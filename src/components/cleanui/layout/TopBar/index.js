import React from 'react'
// import { Image } from 'antd'
import style from './style.module.scss'
// import image from '../../../../resources/images/Royal_Enfield_logo.png'

const TopBar = () => {
  return (
    <div className={style.topbar}>
      {/* <div className="mr-4 d-block" style={{ color: 'white', fontFamily: 'sans-serif', fontSize: '20px' }}>
        <div><h><span style={{color:'#FFC300'}}>Smart</span><span style={{color:'#6495ED'}}>Run</span></h> | <Image width={200} src={image} /></div>
      </div> */}
      <div className="row-call">
        {/* <div className="block"><Image style={{marginTop:'5px'}} width={150} height={25} src={image} preview={false} /></div> */}
        <div className="div1">
          <h1>
            <span style={{ color: '#ff5d22', fontSize: '25px', fontWeight: 'bold' }}>Smart</span>
            <span style={{ color: 'deepskyblue', fontSize: '25px', fontWeight: 'bold' }}>
              Run
            </span>{' '}
            &nbsp;
          </h1>
        </div>
        {/* <div className="block"><Image style={{marginTop:'5px'}} width={150} height={15} src={image} preview={false} /></div> */}
      </div>
    </div>
  )
}

export default TopBar
