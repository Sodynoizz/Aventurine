/*  Character Distribution for Warp Rate */
// Reference: https://game8.co/games/Honkai-Star-Rail/archives/409610
let store = 1
let arr = []

for (let i = 0; i <= 90; i++) {
  store *= i == 0 ? 1 : 1 - chanceFiveStarsCharacter(i - 1)
  const val = store * chanceFiveStarsCharacter(i)
  console.log(i, val.toFixed(20))
  arr[i] = val
}

function chanceFiveStarsCharacter(n: number): number {
  const softStack = Math.max(0, n - 72)
  return 0.00600 + softStack * 0.06
}


