export const PR = data => {
  return {
    label: 'Performance Ratio (%)',
    fill: false,
    backgroundColor: 'green',
    borderColor: 'green',
    data,
    yAxisID: 'A',
  }
}
export const CUF = data => {
  return {
    label: 'CUF (%)',
    fill: false,
    backgroundColor: 'orange',
    borderColor: 'orange',
    data,
    yAxisID: 'B',
  }
}
export const SY = data => {
  return {
    label: 'Specific Yield (kWh/kWp)',
    fill: false,
    backgroundColor: 'rgba(75,192,192,0.4)',
    borderColor: 'rgba(75,192,192,1)',
    data,
    yAxisID: 'C',
  }
}
export const EN = data => {
  return {
    label: 'Energy (MWh)',
    fill: false,
    backgroundColor: 'brown',
    borderColor: 'brown',
    data,
    yAxisID: 'D',
  }
}
export const INS = data => {
  return {
    label: 'Insolation (kWh/m2)',
    fill: false,
    backgroundColor: 'blue',
    borderColor: 'blue',
    data,
    yAxisID: 'E',
  }
}

export const PR_CONFIG = {
  id: 'A',
  type: 'linear',
  position: 'left',
  scaleLabel: {
    display: true,
    labelString: 'Performance Ratio (%)',
    fontSize: 10,
  },
  gridLines: {
    display: true,
  },
  ticks: {
    min: 0,
  },
}

export const CUF_CONFIG = {
  id: 'B',
  type: 'linear',
  position: 'left',
  scaleLabel: {
    display: true,
    labelString: 'CUF (%)',
    fontSize: 10,
  },
  gridLines: {
    display: false,
  },
  ticks: {
    min: 0,
  },
}
export const SY_CONFIG = {
  id: 'C',
  type: 'linear',
  position: 'left',
  scaleLabel: {
    display: true,
    labelString: 'Specific Yield (kWh/kWp)',
    fontSize: 10,
  },
  gridLines: {
    display: false,
  },
  ticks: {
    min: 0,
  },
}
export const EN_CONFIG = {
  id: 'D',
  type: 'linear',
  position: 'right',
  scaleLabel: {
    display: true,
    labelString: 'Energy (MWh)',
    fontSize: 10,
  },
  gridLines: {
    display: false,
  },
  ticks: {
    min: 0,
  },
}

export const INS_CONFIG = {
  id: 'E',
  type: 'linear',
  position: 'right',
  scaleLabel: {
    display: true,
    labelString: 'Insolation (kWh/m2)',
    fontSize: 10,
  },
  gridLines: {
    display: false,
  },
  ticks: {
    min: 0,
  },
}
