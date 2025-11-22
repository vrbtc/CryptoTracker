// 你的专属加密持仓报告 - Grok定制版 (2025)
async function updateReport() {
  try {
    const ids = "bitcoin,ethereum,binancecoin,solana";
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
    const data = await res.json();

    const btc = data.bitcoin.usd;
    const eth = data.ethereum.usd;
    const bnb = data.binancecoin.usd;
    const sol = data.solana.usd;

    const btc24 = (data.bitcoin.usd_24h_change || 0).toFixed(2);
    const eth24 = (data.ethereum.usd_24h_change || 0).toFixed(2);
    const bnb24 = (data.binancecoin.usd_24h_change || 0).toFixed(2);
    const sol24 = (data.solana.usd_24h_change || 0).toFixed(2);

    // 你的持仓盈亏计算
    const btcProfit = ((btc - 100000) / 100000 * 100).toFixed(2);
    const bnbBtcRatio = (bnb / btc).toFixed(6);
    const bnbProfit = ((bnbBtcRatio - 0.00731) / 0.00731 * 100).toFixed(2);
    const solEthRatio = (sol / eth).toFixed(6);
    const solProfit = ((solEthRatio - 0.0633489) / 0.0633489 * 100).toFixed(2);

    // 生成表格HTML
    document.getElementById("report").innerHTML = `
      <h2>实时持仓报告 - ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</h2>
      <table>
        <thead>
          <tr>
            <th>币种</th><th>USD价格</th><th>24h涨跌</th><th>你的持仓盈亏</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>BTC</td><td>$$  {btc.toLocaleString()}</td>
            <td style="color: \( {btc24 >= 0 ? 'green' : 'red'}"> \){btc24}%</td>
            <td style="color: ${btcProfit >= 0 ? 'green' : 'red'}; font-weight: bold;">法币本位: ${btcProfit}%</td>
          </tr>
          <tr>
            <td>ETH</td><td>  $${eth.toLocaleString()}</td>
            <td style="color: $$ {eth24 >= 0 ? 'green' : 'red'}"> $${eth24}%</td>
            <td style="color: gray;">-</td>
          </tr>
          <tr>
            <td>BNB</td><td>$$  {bnb.toLocaleString()}</td>
            <td style="color: \( {bnb24 >= 0 ? 'green' : 'red'}"> \){bnb24}%</td>
            <td style="color: ${bnbProfit >= 0 ? 'green' : 'red'}; font-weight: bold;">vs BTC: ${bnbProfit}%</td>
          </tr>
          <tr>
            <td>SOL</td><td>  $${sol.toLocaleString()}</td>
            <td style="color: $$ {sol24 >= 0 ? 'green' : 'red'}"> $${sol24}%</td>
            <td style="color: ${solProfit >= 0 ? 'green' : 'red'}; font-weight: bold;">vs ETH: ${solProfit}%</td>
          </tr>
        </tbody>
      </table>
      <p>数据来源: CoinGecko | 每30秒自动刷新 | 北京时间</p>
    `;
  } catch (error) {
    document.getElementById("report").innerHTML = `<p style="color: red;">加载失败，请刷新页面！错误: ${error.message}</p>`;
  }
}

// 初始加载 + 定时刷新
updateReport();
setInterval(updateReport, 30000); // 30秒一次
