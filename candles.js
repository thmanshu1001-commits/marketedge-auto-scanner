exports.handler = async function(event) {
  const params = new URLSearchParams((event && event.rawQuery) || "");
  const symbols = (params.get("symbols") || "").split(",").map(s=>s.trim()).filter(Boolean).slice(0,10);
  if (!symbols.length) return {statusCode:400,headers:{"content-type":"application/json","access-control-allow-origin":"*"},body:JSON.stringify({error:"Provide symbols"})};
  const results = {};
  await Promise.all(symbols.map(async symbol=>{
    try {
      if (!/^[A-Z0-9.^=_-]+$/.test(symbol)) throw new Error("Invalid ticker");
      const url = "https://query1.finance.yahoo.com/v8/finance/chart/"+encodeURIComponent(symbol)+"?range=3mo&interval=1d";
      const response = await fetch(url, {headers:{"User-Agent":"Mozilla/5.0"}});
      if (!response.ok) throw new Error("Source HTTP "+response.status);
      const json = await response.json();
      const r = json.chart && json.chart.result && json.chart.result[0];
      if (!r) throw new Error("No chart data returned");
      const q = r.indicators.quote[0], ts = r.timestamp || [];
      const candles=[];
      for(let i=0;i<ts.length;i++){
        if(q.open[i]==null||q.high[i]==null||q.low[i]==null||q.close[i]==null||q.volume[i]==null)continue;
        candles.push({date:new Date(ts[i]*1000).toISOString().slice(0,10),open:q.open[i],high:q.high[i],low:q.low[i],close:q.close[i],volume:q.volume[i]});
      }
      // Exclude today's still-forming candle based on India-local date.
      const today = new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
      results[symbol]={candles:candles.filter(c=>c.date<today)};
    } catch(e) { results[symbol]={error:String(e.message||e)}; }
  }));
  return {statusCode:200,headers:{"content-type":"application/json","cache-control":"public, max-age=300"},body:JSON.stringify({results})};
};