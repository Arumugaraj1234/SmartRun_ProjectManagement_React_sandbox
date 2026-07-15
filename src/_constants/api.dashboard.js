export const GetPrfrmncRatio = prfrmncRecvData => {
    return prfrmncRecvData !== null && prfrmncRecvData !== undefined && prfrmncRecvData !== [] && prfrmncRecvData[0].perfRatio !== null && prfrmncRecvData[0].perfRatio !== '0.000'
        ? `${RoundNumberDecByThree(prfrmncRecvData[0].perfRatio)} \n ${'%'}`
        : 'NA'
}
export const GetTodayExport = receivedData => {
    return receivedData !== null && receivedData !== undefined && receivedData !== [] && receivedData.todayTotalYieldInKwh !== null && receivedData.todayTotalYieldInKwh !== '0'
        ? `${receivedData.todayTotalYieldInKwh} \n ${'GWh'}`
        : 'NA'
}
export const GetPnlCount = pnlcntRecData => {
    return pnlcntRecData !== null && pnlcntRecData !== undefined && pnlcntRecData !== [] && pnlcntRecData[0].panelcount !== null
        ? pnlcntRecData[0].panelcount
        : 'NA'
}

export const GetModTemp = modTempRecData => {
    return modTempRecData !== null && modTempRecData !== undefined && modTempRecData !== [] && modTempRecData[0].moduleTemp !== null && modTempRecData[0].moduleTemp !== '0'
        ? `${modTempRecData[0].moduleTemp} \n ${'° C'}`
        : 'NA'

}

export const GetSpecYield = specYldRecData => {
    return specYldRecData !== null && specYldRecData !== undefined && specYldRecData !== [] && specYldRecData[0].specificyeid !== null
        ? `${RoundNumberDecByThree(specYldRecData[0].specificyeid)} \n ${'kWh/kWp'}`
        : 'NA'
}

export const GetambientTemp = ambntTempRecData => {
    return ambntTempRecData !== null && ambntTempRecData !== undefined && ambntTempRecData !== [] && ambntTempRecData[0].ambientTemp !== null && ambntTempRecData[0].ambientTemp !== '0' && ambntTempRecData[0].ambientTemp !== ''
        ? `${RoundNumberDecByTwo(ambntTempRecData[0].ambientTemp)} \n ${'° C'}`
        : 'NA'
}

export const GetcufVal = cufRecData => {
    return cufRecData !== null && cufRecData !== undefined && cufRecData !== [] && cufRecData[0].curval !== null && cufRecData[0].curval !== '0.000'
        ? `${RoundNumberDecByThree(cufRecData[0].curval)} \n ${'%'}`
        : 'NA'
}

export const GetgatewayVal = gateRecData => {
    return gateRecData !== null && gateRecData !== undefined && gateRecData !== [] && gateRecData[0].gatewaycount !== null
        ? gateRecData[0].gatewaycount
        : 'NA'
}

export const Getajbcountval = ajbRecData => {
    return ajbRecData !== null && ajbRecData !== undefined && ajbRecData !== [] && ajbRecData[0].ajbcount !== null && ajbRecData[0].ajbcount !== '0'
        ? ajbRecData[0].ajbcount
        : 'NA'
}

export const Getplantaddress = plntaddress => {
    return plntaddress !== null && plntaddress !== undefined && plntaddress !== [] && plntaddress.hdrlist[0].plantmaster.plantname !== null
        ? plntaddress.hdrlist[0].plantmaster.plantname
        : 'NA'
}

export const Getplantaddress1 = addressone => {
    return addressone !== null && addressone !== undefined && addressone !== [] && addressone.hdrlist[0].plantlocation.plantaddress1 !== null
        ? addressone.hdrlist[0].plantlocation.plantaddress1
        : ' '
}

export const Getplantaddress2 = addresstwo => {
    return addresstwo !== null && addresstwo !== undefined && addresstwo !== [] && addresstwo.hdrlist[0].plantlocation.plantaddress2 !== null
        ? addresstwo.hdrlist[0].plantlocation.plantaddress2
        : ' '
}

export const Getplantaddress3 = addressthree => {
    return addressthree !== null && addressthree !== undefined && addressthree !== [] && addressthree.hdrlist[0].plantlocation.plantaddress3 !== null
        ? addressthree.hdrlist[0].plantlocation.plantaddress3
        : ' '
}
export const Getplantaddress4 = addressfour => {
    return addressfour !== null && addressfour !== undefined && addressfour !== [] && addressfour.hdrlist[0].plantlocation.plant_address4 !== null
        ? addressfour.hdrlist[0].plantlocation.plant_address4
        : ' '
}

export const Getinvrtrcnt = invrtrcntRecData => {
    return invrtrcntRecData !== null && invrtrcntRecData !== undefined && invrtrcntRecData !== [] && invrtrcntRecData[0].invertorcount !== null
        ? invrtrcntRecData[0].invertorcount
        : 'NA'
}

export const Getaccapacity = accapcity => {
    return accapcity !== null && accapcity !== undefined && accapcity !== [] && accapcity[0].accapacity !== null
        ? `${accapcity[0].accapacity} \n ${'MW'}`
        : 'NA'
}

export const Gettotalinvrtrcap = totalinvrtrcap => {
    return totalinvrtrcap !== null && totalinvrtrcap !== undefined && totalinvrtrcap !== [] && totalinvrtrcap[0].totalinvertercapacity !== null && totalinvrtrcap[0].totalinvertercapacity !== '0'
        ? `${totalinvrtrcap[0].totalinvertercapacity} \n ${'kW'}`
        : 'NA'
}

export const Getcurrentpwr = crntpwr => {
    return crntpwr !== null && crntpwr !== undefined && crntpwr !== [] && crntpwr[0].currentpower !== null && crntpwr[0].currentpower !== '0'
        ? `${RoundNumber(crntpwr[0].currentpower)} \n ${'kW'}`
        : 'NA'
}

export const Gettreecount = treecount => {
    return treecount !== null && treecount !== undefined && treecount !== [] && treecount[0].treescount !== null
        ? `${RoundNumber(treecount[0].treescount)} \n ${'k'}`
        : 'NA'
}

export const Getcarbonemssnsvd = carbonemssion => {
    return carbonemssion !== null && carbonemssion !== undefined && carbonemssion !== [] && carbonemssion[0].carbonemissionsaved !== null && carbonemssion[0].carbonemissionsaved !== '0'
        ? `${RoundNumberDecByTwo(carbonemssion[0].carbonemissionsaved)} \n ${'MTon'}`
        : 'NA'
}

export const GetTotalExport = receivedData => {
    return receivedData !== null && receivedData !== undefined && receivedData !== [] && receivedData.totalyieldInKwh !== null && receivedData.totalyieldInKwh !== '0'
        ? `${receivedData.totalyieldInKwh} \n ${'MWh'}`
        : 'NA'
}

export const GetWindSpeed = receivedData => {
    return receivedData !== null && receivedData !== undefined && receivedData !== [] && receivedData[0].windspeed !== null && receivedData[0].windspeed !== '0'
        ? `${RoundNumberDecByTwo(receivedData[0].windspeed)} \n ${'m/s'}`
        : 'NA'

}

export const GetDCCapacity = dcreceivedData => {
    return dcreceivedData !== null && dcreceivedData !== undefined && dcreceivedData !== [] && dcreceivedData[0].dccapacity !== null
        ? `${dcreceivedData[0].dccapacity} \n ${'MWp'}`
        : 'NA'
}

export const GetInsulation = insltnReceivedData => {
    return insltnReceivedData !== null &&
        insltnReceivedData !== undefined &&
        insltnReceivedData !== [] && insltnReceivedData[0].insulation !== null && insltnReceivedData[0].insulation !== '0.000'
        ? `${RoundNumberDecByThree(insltnReceivedData[0].insulation)} \n ${'kWh/m2'}`
        : 'NA'
}

export const RoundNumberDecByTwo = (inpValue) => {
    
    const finalValue = Math.round(inpValue * 100) / 100
    return finalValue;
}

export const RoundNumberDecByThree = (inpValue) => {
    
    const finalValue = Math.round(inpValue * 1000) / 1000
    return finalValue;
}

export const RoundNumber = (inpValue) => {
    
    const finalValue = Math.round(inpValue)
    return finalValue;
}
export const eventService = {
    GetPrfrmncRatio, GetTodayExport, GetPnlCount,
};