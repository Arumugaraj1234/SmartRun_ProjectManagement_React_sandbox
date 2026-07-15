import React, { useState, useEffect } from 'react'
import store from 'store'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import Sidebar from 'components/cleanui/layout/Sidebar'
import SupportChat from 'components/cleanui/layout/SupportChat'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import style from './style.module.scss'

const mapStateToProps = ({ settings }) => ({
  logo: settings.logo,
  isGrayTopbar: settings.isGrayTopbar,
  isCardShadow: settings.isCardShadow,
  isSquaredBorders: settings.isSquaredBorders,
  isBorderless: settings.isBorderless,
  authPagesColor: settings.authPagesColor,
})

// // Mapping of URLs to background images
// const urlToBackgroundImage = {
//   'https://bgrn.mysmartrun.com/': 'url(resources/images/BGRN_Custom_Image.jpg)',
//   'https://example1.com/': 'url(resources/images/Example1_Image.jpg)',
//   'https://example2.com/': 'url(resources/images/Example2_Image.jpg)',
//   'https://example3.com/': 'url(resources/images/Example3_Image.jpg)',
//   // Add more mappings as needed
// };

// // Default background image if URL does not match any key
// const defaultBackgroundImage = authPagesColor === 'white'
//   ? 'url(resources/images/BGR_Image2.jpg)'
//   : 'url(resources/images/bgmobile.jpg)';

// // Determine the background image based on the current URL
// const backgroundImage = urlToBackgroundImage[currentURL] || defaultBackgroundImage;

const AuthLayout = ({
  children,
  logo,
  isGrayTopbar,
  isCardShadow,
  isSquaredBorders,
  isBorderless,
  authPagesColor,
}) => {
  const currentURL = window.location.href

  // const response = await indentFileUpload({
  //   requestPath: 'getProjdtlOrdById',
  //   requestData: {
  //     tenantID: tenantid,
  //   },

  const [backgroundImage, setBackgroundImage] = useState('')

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const props = {
          tenantID: currentURL,
        }
        const response = await indentFileUpload({
          requestPath: 'getImageUrl',
          requestData: props,
        })
        if (response.responseCode === '200') {
          const base64Image = response?.responseDataMessage
          const tenantid = response?.responseMessage
          store.set('tenantId', tenantid)
          setBackgroundImage(`url(data:image/jpeg;base64,${base64Image})`)
        } else {
          setBackgroundImage(
            authPagesColor === 'white'
              ? 'url(resources/images/BGR_Image2.jpg)'
              : 'url(resources/images/bgmobile.jpg)',
          )
        }
      } catch (error) {
        console.error('Error fetching background image:', error)
        setBackgroundImage(
          authPagesColor === 'white'
            ? 'url(resources/images/BGR_Image2.jpg)'
            : 'url(resources/images/bgmobile.jpg)',
        )
      }
    }

    fetchBackgroundImage()
  }, [currentURL, authPagesColor])

  // const isBGRN = currentURL.startsWith('https://bgrn.mysmartrun.com/');
  //   const backgroundImage = isBGRN
  //     ? 'url(D:/DhineshPV/Project_Docs/image_royal_1.png)' // Change this to the desired image for BGRN
  //     : authPagesColor === 'white'
  //       ? 'url(D:/DhineshPV/Project_Docs/istockphoto-1349092565-612x612.jpg)'
  //       : 'url(resources/images/bgmobile.jpg)';

  return (
    <Layout>
      <Layout.Content style={{ backgroundColor: 'white' }}>
        <Sidebar />
        <SupportChat />
        <div
          className={classNames(`${style.container}`, {
            cui__layout__squaredBorders: isSquaredBorders,
            cui__layout__cardsShadow: isCardShadow,
            cui__layout__borderless: isBorderless,
            [style.white]: authPagesColor === 'white',
            [style.gray]: authPagesColor === 'gray',
          })}
          style={{
            backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '69%',
            // maxWidth: '100%',
            height: '100%',
            // '@media (max-width: 1440px)': {
            //   maxWidth: '69%',
            // },
            // '@media (max-width: 768px)': {
            //   maxWidth: '50%',
            // },
            // '@media (max-width: 425px)': {
            //   maxWidth: '45%',
            // },
          }}
        // style={{
        //   backgroundImage:
        //     authPagesColor === 'white'
        //       ? 'url(resources/images/BGR_Image2.jpg)'
        //       : 'url(resources/images/bgmobile.jpg)',
        //   width:"auto"
        // }}
        >
          {/* <div>
            <video autoPlay loop muted className={style.backgroundVideo}>
              <source src="resources/videos/BGR_Background_Video.mp4" type="video/mp4" />
            </video>
          </div> */}
          <div
            className={classNames(`${style.topbar}`, {
              [style.topbarGray]: isGrayTopbar,
            })}
          >
            <div className={style.logoContainer}>
              <div className={style.logo}>
                <img src="resources/images/logo.png" className="mr-2" alt="Clean UI" style={{ width: '100px', height: 'auto' }} />
                <div className={style.name}>{logo}</div>
                {logo === 'vLogixTech'}
              </div>
            </div>
          </div>
          <div className={style.containerInner}>{children}</div>
          <div style={{ position: 'fixed', bottom: 0, right: 0, textAlign: 'right', margin: '10px' }}>
            <h6 style={{ margin: 0 }}>
              Software rights owned by
              <span style={{ color: '#ff5d22' }}> Smart</span>
              <span style={{ color: 'deepskyblue' }}>Run</span> Tech Pvt. Ltd.,
            </h6>
            <a
              href="https://www.smartruntech.com/"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              www.smartruntech.com
            </a>
          </div>

        </div>
      </Layout.Content>
    </Layout>
  )
}

export default withRouter(connect(mapStateToProps)(AuthLayout))
