const drawerList = [];

const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

for (let row of rows) {
  for (let level = 1; level <= 5; level++) {
    for (let col = 1; col <= 22; col++) {
      drawerList.push(`${row}${level}-${col}`);
    }
  }
}

module.exports = drawerList;
