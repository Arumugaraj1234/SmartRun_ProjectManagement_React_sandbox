import { message } from 'antd'

const messageMap = {
  '200': () => message.success('Success'),
  '301': () => message.success('OTP has been sent successfully'),
  '210': () => message.success('Succesfully Downloaded'),
  '211': () => message.success('Updated Succesfully'),
  '212': () => message.success('Successfully Inserted'),
  '213': () => message.success('Successfully Added'),
  '214': () => message.success('File Uploaded Successfully'),

  '311': () => message.info('No Records Found'),
  '312': () => message.info('Only three pages can be added to your bookmarks.'),

  '400': () => message.error('Bad Request'),
  '401': () => message.error('Unauthorized'),
  '403': () => message.error('Forbidden'),
  '404': () => message.error('Not Found'),
  '405': () => message.error('Enter values for fields marked mandatory (*)'),
  '409': () => message.error('Method Not Allowed'),
  '500': () => message.error('Internal Server Error'),

  '601': () => message.error('Uploaded file size to be lesser than 100 MB'),
  '602': () => message.error('Enter a valid OTP'),
  '603': () => message.error(`Indent Template doesn't have any data to process.`),
  '604': () => message.error('Return Qty. should not be greater than Available Qty.'),
  '605': () => message.error('Select a Stage'),
  '606': () => message.error('File Download failed'),
  '607': () => message.error('Something went wrong'),
  '608': () => message.error('Please Select Employee'),
  '609': () => message.error('Choose File Before Upload'),
  '610': () => message.error('An error occurred during file upload'),
  '611': () => message.error('Percentage cannot be higher than 100'),
  '612': () => message.error('Allocated Budget should be less than or equal to Available Budget'),
  '613': () => message.error('Budget Cost should not be greater than Available Budget.'),
  '614': () => message.error('Target Cost should not be greater than Available Budget.'),
  '615': () => message.error('Required Qty cannot be higher than the Available Qty.'),
  '616': () => message.error('No Records Selected'),
  '617': () => message.error('No records to insert '),
  '618': () => message.error('Requested By and Requested To can not be same'),
  '619': () => message.error('No Records Found'),
  '620': () => message.error('Planned Start Date should set before Due Date'),
  '621': () => message.error('Due Date cannot before Planned Start Date'),
  '622': () => message.error('Option not available'),
  '623': () => message.error(`Document Status already exists`),
  '624': () => message.error('Please enter a designation to add'),
  '625': () => message.error('Designation already exists'),
  '626': () => message.error('Select a Version to Set as Default'),
  '627': () => message.error('Minimum one field should be change'),
  '628': () => message.error('Email is not a valid.'),
  '629': () => message.error('Requested Qty. should not be greater than Available Qty.'),
  '630': () => message.error('Allocated Qty. should not be greater than Inventory Qty.'),
  '631': () => message.error("Allocate Qty Shouldn't be 0 or empty"),
  '632': () => message.error('Minumim one Allocate Qty Should be enter'),
  '633': () => message.error('Failed to Insert'),
  '634': () => message.error('File Uploaded Failed'),
  '635': () => message.error('Failed to Delete'),
  '636': () => message.error('TDS must be between 0 and 100'),
  '637': () => message.error('Select the Department'),
  '638': () => message.error('Remark Field is Mandatory'),
  '639': () => message.error('Reason is Too Long'),
  '640': () => message.error('Sum of qty entered should not be greater than the CA qty'),
  '641': () => message.error('CA qty should be equal to the sum of qty entered'),
  '642': () => message.error('Dupliacte Serial No. not allowed'),
  '643': () =>
    message.error(
      'Sum of all inspected qty cannot be higher or lower than the No. of items offered for inspection.',
    ),
  '644': () => message.error('Choose any File and File Type Before Upload'),
  '645': () => message.error('To date cannot be greater than From date'),
  '646': () => message.error('Project Name is Too Long'),
  '647': () => message.error('Tentative PO Value is Too Long'),
  '648': () => message.error('Project Detail is Too Long'),
  '649': () => message.error('Location Name is Too Long'),
  '650': () => message.error('Mobile No. should not be greater than 10 digits'),
  '651': () => message.error('Contact Name is Too Long'),
  '652': () => message.error('Email is Too Long'),
  '653': () => message.error('Mobile No. should not be lesser than 10 digits'),
  '654': () => message.error('At least one primary contact required'),
  '655': () => message.error('City Name is Too Long'),
  '656': () => message.error('State Name is Too Long'),
  '657': () => message.error('Pin Code is Too Long'),
  '658': () => message.error('Country Name is Too Long'),
  '659': () => message.error('Address is Too Long'),
  '660': () => message.error('You cannot Allocate more than Indent Qty'),
  '661': () => message.error('Allocate some Qty to Create an Indent Group'),
  '662': () => message.error("From and To address can't be same "),
  '663': () => message.error('Qty. cannot be greater than the qty. available to GRN'),
  '664': () => message.error('Qty. cannot be 0 to GRN'),
  '665': () => message.error('Minimum one GRN Qty should be enter'),
  '666': () => message.error('Insufficient Value'),
  '667': () => message.error("Adjustment Qty Shouldn't be zero"),
  '668': () => message.error(`Transfer Qty Shouldn't be zero`),
  '669': () => message.error("Transfer Qty Shouldn't Greater then Available Qty"),
  '670': () => message.error('Inward Qty. is higher than the Qty. available for inward.'),
  '671': () => message.error('Please Enter Atleast One Inward Quantity'),
  '672': () => message.error('Issued Qty. cannot be higher than Request Qty.'),
  '673': () => message.error('Please Select PO Type'),
  '674': () => message.error('Please enter only whole numbers.'),
  '675': () =>
    message.error('Inspected Qty and GRN Received Qty. should not be greater than GRN Qty.'),
  '676': () => message.error('Entered Quantity cannot be greater than Pending Quantity'),
  '677': () => message.error('HSN Code should be of 8 digits'),
  '678': () => message.error('Total percentage should be less than 100%'),
  '679': () => message.error('Set Percentage value more than 0'),
  '680': () => message.error('Please fill atleast one row'),
  '681': () => message.error('Decimal values are not allowed'),
  '682': () =>
    message.error('Rework Quantity and Requested Quantity cannot be greater than Pending Quantity'),
  '683': () => message.error('The total hours exceed 24. Please adjust the hours.'),
  '684': () =>
    message.error('Available Budget is greater than 0 so unable to provide Target cost is 0'),
  '685': () => message.error('Amount should not be lesser than PRA raised for this indent group'),
  '686': () => message.error('Please Add Debit Note for this PO.'),
  '687': () => message.error('Required Qty cannot be greater than Balance Qty.'),
  '688': () =>
    message.error('From and To Location cannot be same when From and To Project are same'),
}

const messageReturn = (code, content, type) => {
  const codeStr = String(code)
  const showMessage = messageMap[codeStr]

  if (code === null) {
    if (type === 'success') {
      message.success(content)
    }
    if (type === 'error') {
      message.error(content)
    }
    if (type === 'info') {
      message.info(content)
    }
  }
  if (code !== null) {
    if (showMessage) {
      showMessage(content)
    } else {
      message.error('Unknown error')
    }
  }
}

export default messageReturn
