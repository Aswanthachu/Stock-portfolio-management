export const portfolioInfoData = {
  "Total Investment": {
    description: `<p><span style="font-size: 9pt;">The total investment is the sum of the funds allocated to purchase stocks without accounting for the broker service charge. Let's consider a user who has made investments in three different portfolios:</span></p>
    <ol>
    <li>
    <p><span style="font-size: 9pt;"><strong>Portfolio 1:</strong></span></p>
    <ul>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">User's Initial Investment = $10,000</span></li>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">Broker Service Charge = 1.5% of $10,000 = $150</span></li>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">Total Investment for Stocks in Portfolio 1 = $10,000</span></li>
    </ul>
    </li>
    <li style="font-size: 9pt;">
    <p><span style="font-size: 9pt;"><strong>Portfolio 2:</strong></span></p>
    <ul>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">User's Initial Investment = $5,000</span></li>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">Broker Service Charge = 1.5% of $5,000 = $75</span></li>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">Total Investment for Stocks in Portfolio 2 = $5,000</span></li>
    </ul>
    </li>
    <li style="font-size: 9pt;">
    <p><span style="font-size: 9pt;"><strong>Portfolio 3:</strong></span></p>
    <ul>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">User's Initial Investment = $15,000</span></li>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">Broker Service Charge = 1.5% of $15,000 = $225</span></li>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">Total Investment for Stocks in Portfolio 3 = $15,000</span></li>
    </ul>
    </li>
    </ol>
    <p><span style="font-size: 9pt;"><strong>Total Investment Across Portfolios:</strong></span></p>
    <ul>
    <li style="font-size: 9pt;"><span class="math math-inline" style="font-size: 9pt;"><span class="katex-error" title="ParseError: KaTeX parse error: Can't use function '$' in math mode at position 1: $̲10,000 + $5,000&hellip;">$10,000 + $5,000 + $15,000 = $30,000</span></span></li>
    </ul>
    <p><span style="font-size: 9pt;">In this example, the total investment made by the user across different portfolios amounts to $30,000. This figure represents the cumulative funds committed to various stocks before accounting for broker service charges. It provides a comprehensive view of the user's financial commitment in the stock market, aiding in the assessment of overall investment strategies and performance.</span></p>`,
  },
  "Capital Gain": {
    description: `<p><span style="font-size: 9pt;">Capital gain in a stock portfolio represents the profit or loss generated from the difference between the current value of the portfolio and the total investment made. The formula for capital gain is:</span></p>
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex"><span class="katex-mathml">Capital&nbsp;Gain=Total&nbsp;Value&nbsp;for&nbsp;Shares&minus;Total&nbsp;Investment</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Capital&nbsp;Gain</span></span><span class="mrel">=<br/></span></span><span class="base"><span class="mord text"><span class="mord">Total&nbsp;Value&nbsp;for&nbsp;Shares</span></span><span class="mbin">&minus;</span></span><span class="base"><span class="mord text"><span class="mord">Total&nbsp;Investment</span></span></span></span></span></span></p>
    <p><span style="font-size: 9pt;">Additionally, the capital gain percentage is calculated as the percentage increase or decrease relative to the total investment:</span></p>
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex"><span class="katex-mathml">Capital&nbsp;Gain&nbsp;Percentage=(Capital&nbsp;Gain&times;100Total&nbsp;Investment)</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Capital&nbsp;Gain&nbsp;Percentage</span></span><span class="mrel">=</span></span><span class="base"><span class="minner"><span class="mopen delimcenter"><span class="delimsizing size2">(</span></span><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord text mtight">Total&nbsp;Investment</span></span></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord text mtight">Capital&nbsp;Gain</span><span class="mbin mtight">&times;</span>100</span></span></span><span class="vlist-s">​</span></span></span></span></span><span class="mclose delimcenter"><span class="delimsizing size2">)</span></span></span></span></span></span></span></p>
    <p><span style="font-size: 9pt;"><strong>Example:</strong></span></p>
    <p><span style="font-size: 9pt;">Let's assume a user invests $10,000 in a stock portfolio, and the current value of the portfolio is $12,500.</span></p>
    <ol>
    <li style="font-size: 9pt;">
    <p><span style="font-size: 9pt;"><strong>Given Data:</strong></span></p>
    <ul>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">Total Investment (<span class="math math-inline"><span class="katex"><span class="katex-mathml">Total&nbsp;Investment&nbsp;USD</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Total&nbsp;Investment&nbsp;USD</span></span></span></span></span></span>): $10,000</span></li>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">Total Value for Shares (<span class="math math-inline"><span class="katex"><span class="katex-mathml">Total&nbsp;Value&nbsp;for&nbsp;Share&nbsp;USD</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Total&nbsp;Value&nbsp;for&nbsp;Share&nbsp;USD</span></span></span></span></span></span>): $12,500</span></li>
    </ul>
    </li>
    <li style="font-size: 9pt;">
    <p><span style="font-size: 9pt;"><strong>Calculation:</strong></span></p>
    <ul>
    <li style="font-size: 9pt;">
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex"><span class="katex-mathml">Capital&nbsp;Gain=Total&nbsp;Value&nbsp;for&nbsp;Share&nbsp;USD&minus;Total&nbsp;Investment&nbsp;USD</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Capital&nbsp;Gain</span></span><span class="mrel">=<br/></span></span><span class="base"><span class="mord text"><span class="mord">Total&nbsp;Value&nbsp;for&nbsp;Share&nbsp;USD</span></span><span class="mbin">&minus;</span></span><span class="base"><span class="mord text"><span class="mord">Total&nbsp;Investment&nbsp;USD</span></span></span></span></span></span></p>
    </li>
    <li style="font-size: 9pt;">
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex-error" title="ParseError: KaTeX parse error: Can't use function '$' in math mode at position 23: &hellip;apital Gain} = $̲12,500 - $10,00&hellip;">Capital Gain = $12,500 - $10,000 = $2,500</span></span></p>
    </li>
    <li style="font-size: 9pt;">
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex"><span class="katex-mathml">Capital&nbsp;Gain&nbsp;Percentage=(Capital&nbsp;Gain&times;100Total&nbsp;Investment&nbsp;USD)</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Capital&nbsp;Gain&nbsp;Percentage</span></span><span class="mrel">=</span></span><span class="base"><span class="minner"><span class="mopen delimcenter"><span class="delimsizing size2">(</span></span><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord text mtight">Total&nbsp;Investment&nbsp;USD</span></span></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord text mtight">Capital&nbsp;Gain</span><span class="mbin mtight">&times;</span>100</span></span></span><span class="vlist-s">​</span></span></span></span></span><span class="mclose delimcenter"><span class="delimsizing size2">)</span></span></span></span></span></span></span></p>
    </li>
    <li style="font-size: 9pt;">
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex-error" title="ParseError: KaTeX parse error: Can't use function '$' in math mode at position 47: &hellip;= \left( \frac{$̲2,500 \times 10&hellip;">Capital Gain Percentage = $2,500 * 100 / $10,000 = 25%</span></span></p>
    </li>
    </ul>
    </li>
    <li style="font-size: 9pt;">
    <p><span style="font-size: 9pt;"><strong>Result:</strong></span></p>
    <ul>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">The capital gain is $2,500, indicating a 25% increase relative to the initial investment. This measure helps assess the profitability of the stock portfolio, providing insights into the investment's performance. Positive values denote gains, while negative values signify losses.</span></li>
    </ul>
    </li>
    </ol>`,
  },
  "Currency Gain": {
    description: `<p><span style="font-size: 9pt;">Currency gain in a stock portfolio refers to the profit or loss arising from changes in the exchange rate between two currencies. In this context, the formula for currency gain is:</span></p>
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex"><span class="katex-mathml">Currency&nbsp;Gain=Current&nbsp;USD&nbsp;Price&minus;Average&nbsp;of&nbsp;Total&nbsp;INR&nbsp;Cost</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Currency&nbsp;Gain</span></span><span class="mrel">=</span></span><span class="base"><span class="mord text"><span class="mord">Current&nbsp;USD&nbsp;Price</span></span><span class="mbin">&minus;</span></span><span class="base"><span class="mord text"><span class="mord">Average&nbsp;of&nbsp;Total&nbsp;INR&nbsp;Cost</span></span></span></span></span></span></p>
    <p><span style="font-size: 9pt;">Additionally, the currency gain percentage represents the percentage increase or decrease relative to the current USD price:</span></p>
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex"><span class="katex-mathml">Currency&nbsp;Gain&nbsp;Percentage=(Currency&nbsp;GainCurrent&nbsp;USD&nbsp;Price)&times;100</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Currency&nbsp;Gain&nbsp;Percentage</span></span><span class="mrel">=</span></span><span class="base"><span class="minner"><span class="mopen delimcenter"><span class="delimsizing size2">(</span></span><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord text mtight">Current&nbsp;USD&nbsp;Price</span></span></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord text mtight">Currency&nbsp;Gain</span></span></span></span><span class="vlist-s">​</span></span></span></span></span><span class="mclose delimcenter"><span class="delimsizing size2">)</span></span></span><span class="mbin">&times;</span></span><span class="base"><span class="mord">100</span></span></span></span></span></p>
    <p><span style="font-size: 9pt;"><strong>Example:</strong></span></p>
    <p><span style="font-size: 9pt;">Consider a scenario where a user initially buys stocks when the INR/USD exchange rate is at an average cost. Subsequently, the exchange rate changes, resulting in a new USD price. Here's how the currency gain is calculated:</span></p>
    <ol>
    <li style="font-size: 9pt;">
    <p><span style="font-size: 9pt;"><strong>Given Data:</strong></span></p>
    <ul>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">Current USD Price (<span class="math math-inline"><span class="katex"><span class="katex-mathml">USD&nbsp;Price</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">USD&nbsp;Price</span></span></span></span></span></span>): $75</span></li>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">Average of Total INR Cost (<span class="math math-inline"><span class="katex"><span class="katex-mathml">Average&nbsp;INR&nbsp;Cost</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Average&nbsp;INR&nbsp;Cost</span></span></span></span></span></span>): $70</span></li>
    </ul>
    </li>
    <li style="font-size: 9pt;">
    <p><span style="font-size: 9pt;"><strong>Calculation:</strong></span></p>
    <ul>
    <li style="font-size: 9pt;">
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex"><span class="katex-mathml">Currency&nbsp;Gain=Current&nbsp;USD&nbsp;Price&minus;Average&nbsp;INR&nbsp;Cost</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Currency&nbsp;Gain</span></span><span class="mrel">=</span></span><span class="base"><span class="mord text"><span class="mord">Current&nbsp;USD&nbsp;Price</span></span><span class="mbin">&minus;</span></span><span class="base"><span class="mord text"><span class="mord">Average&nbsp;INR&nbsp;Cost</span></span></span></span></span></span></p>
    </li>
    <li style="font-size: 9pt;">
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex-error" title="ParseError: KaTeX parse error: Can't use function '$' in math mode at position 24: &hellip;rrency Gain} = $̲75 - $70 = $5">Currency Gain = $75 - $70 = $5</span></span></p>
    </li>
    <li style="font-size: 9pt;">
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex"><span class="katex-mathml">Currency&nbsp;Gain&nbsp;Percentage=(Currency&nbsp;GainCurrent&nbsp;USD&nbsp;Price)&times;100</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Currency&nbsp;Gain&nbsp;Percentage</span></span><span class="mrel">=</span></span><span class="base"><span class="minner"><span class="mopen delimcenter"><span class="delimsizing size2">(</span></span><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord text mtight">Current&nbsp;USD&nbsp;Price</span></span></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord text mtight">Currency&nbsp;Gain</span></span></span></span><span class="vlist-s">​</span></span></span></span></span><span class="mclose delimcenter"><span class="delimsizing size2">)</span></span></span><span class="mbin">&times;</span></span><span class="base"><span class="mord">100</span></span></span></span></span></p>
    </li>
    <li style="font-size: 9pt;">
    <p><span class="math math-inline" style="font-size: 9pt;"><span class="katex-error" title="ParseError: KaTeX parse error: Can't use function '$' in math mode at position 48: &hellip;= \left( \frac{$̲5}{$75} \right)&hellip;">Currency Gain Percentage = $5 / $75 * 100 = 6.67%</span></span></p>
    </li>
    </ul>
    </li>
    <li style="font-size: 9pt;">
    <p><span style="font-size: 9pt;"><strong>Result:</strong></span></p>
    <ul>
    <li style="font-size: 9pt;"><span style="font-size: 9pt;">The currency gain is $5, indicating a 6.67% increase relative to the initial average INR/USD cost. This measure helps assess the impact of currency fluctuations on the overall portfolio value, providing insights into the currency-related aspects of the investment. Positive values denote gains, while negative values signify losses.</span></li>
    </ul>
    </li>
    </ol>`,
  },
  "Total Returns": {
    description: `<ol>
    <li style="font-size: 9pt;">
    <ul>
    <li style="font-size: 9pt;">
    <p>Total returns in a stock portfolio represent the overall profit or loss obtained by subtracting the initial total investment (excluding broker service charge) from the current portfolio value. This metric provides a comprehensive view of the investment's performance, considering both capital gains and any impact from currency fluctuations or service charges.</p>
    <p><span class="math math-inline"><span class="katex"><span class="katex-mathml">Total&nbsp;Returns=Current&nbsp;Portfolio&nbsp;Value&minus;Total&nbsp;Investment&nbsp;(excluding&nbsp;Broker&nbsp;Service&nbsp;Charge)</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Total&nbsp;Returns</span></span><span class="mrel">=<br/></span></span><span class="base"><span class="mord text"><span class="mord">Current&nbsp;Portfolio&nbsp;Value</span></span><span class="mbin">&minus;</span></span><span class="base"><span class="mord text"><span class="mord">Total&nbsp;Investment&nbsp;(excluding&nbsp;Broker&nbsp;Service&nbsp;Charge)</span></span></span></span></span></span></p>
    <p><strong>Example:</strong></p>
    <p>Let's illustrate total returns using a hypothetical scenario:</p>
    <ol>
    <li>
    <p><strong>Given Data:</strong></p>
    <ul>
    <li>Total Investment (excluding Broker Service Charge): $10,000</li>
    <li>Current Portfolio Value: $12,500</li>
    </ul>
    </li>
    <li>
    <p><strong>Calculation:</strong></p>
    <ul>
    <li><span class="math math-inline"><span class="katex"><span class="katex-mathml">Total&nbsp;Returns=Current&nbsp;Portfolio&nbsp;Value&minus;Total&nbsp;Investment&nbsp;(excluding&nbsp;Broker&nbsp;Service&nbsp;Charge)</span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord text"><span class="mord">Total&nbsp;Returns</span></span><span class="mrel">=<br/></span></span><span class="base"><span class="mord text"><span class="mord">Current&nbsp;Portfolio&nbsp;Value</span></span><span class="mbin">&minus;</span></span><span class="base"><span class="mord text"><span class="mord">Total&nbsp;Investment&nbsp;(excluding&nbsp;Broker&nbsp;Service&nbsp;Charge)</span></span></span></span></span></span></li>
    <li><span class="math math-inline"><span class="katex-error" title="ParseError: KaTeX parse error: Can't use function '$' in math mode at position 24: &hellip;tal Returns} = $̲12,500 - $10,00&hellip;">Total Returns = $12,500 - $10,000 = $2,500</span></span></li>
    </ul>
    </li>
    <li>
    <p><strong>Result:</strong></p>
    <ul>
    <li>The total returns amount to $2,500, reflecting the overall profitability of the stock portfolio after accounting for initial investment costs (excluding broker service charge). Positive values denote gains, while negative values signify losses. This measure is crucial for evaluating the success of the investment strategy and understanding the financial outcome of the portfolio.</li>
    </ul>
    </li>
    </ol>
    <span style="font-size: 9pt;">ost. This measure helps assess the impact of currency fluctuations on the overall portfolio value, providing insights into the currency-related aspects of the investment. Positive values denote gains, while negative values signify losses.</span></li>
    </ul>
    </li>
    </ol>`,
  },
};
