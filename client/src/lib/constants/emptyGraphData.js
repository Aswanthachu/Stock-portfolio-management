const emptyData=[];  

for (let i = 0; i < 100; i++) {
  const date = new Date();
  date.setDate(date.getDate() + i);
  const formattedDate = date.toISOString().split('T')[0];
  emptyData.push({time:formattedDate})
}

export  default emptyData;
