## Calculate APY for MiniChef

### 1. **Calculate the Pool’s Reward Rate in Tokens**
- **Reward Per Second for the Pool:**
  \[
  \text{Reward per second for Pool} = \frac{\text{rewardPerSecond} \times \text{allocPoint for Pool}}{\text{totalAllocPoint}}
  \]

### 2. **Estimate the Daily Rewards in Tokens**
- **Daily Reward in Tokens:**
  \[
  \text{Daily Reward} = \text{Reward per second for Pool} \times 86400
  \]

### 3. **Calculate the Pool's Total Staked Amount**
This is the total amount of LP tokens staked in the pool.

- **Total LP Tokens Staked in Pool:**
  \[
  \text{Total LP Tokens Staked} = \text{LP Tokens in Pool}
  \]

### 4. **Calculate the Daily Yield in Tokens**
The daily yield in tokens is the number of reward tokens distributed per LP token staked.

- **Daily Yield in Tokens:**
  \[
  \text{Daily Yield} = \frac{\text{Daily Reward}}{\text{Total LP Tokens Staked}}
  \]

### 5. **Annualize the Yield**
To calculate the APY in reward tokens, annualize the daily yield.

- **APY in Reward Tokens:**
  \[
  \text{APY (in reward tokens)} = \left(1 + \text{Daily Yield}\right)^{365} - 1
  \]

### Summary
- **APY (in reward tokens)** reflects how many reward tokens a user earns annually for each LP token staked, assuming the current reward distribution and LP token staking levels remain constant.

### Example Calculation (Hypothetical)
- Reward per second for Pool: `0.001` reward tokens
- Total LP Tokens Staked: `100,000` LP tokens
- Daily Reward: `0.001 * 86400 = 86.4` reward tokens
- Daily Yield in Tokens: `86.4 / 100,000 = 0.000864` reward tokens per LP token
- APY (in reward tokens): `((1 + 0.000864) ^ 365) - 1 ≈ 0.334` or **33.4% APY**

This method calculates how many reward tokens an LP token holder can expect to earn over a year in terms of reward tokens.
