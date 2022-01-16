import React, { useState, useRef, useEffect } from "react";
import imagemMapa from '../images/map-location.jpg'
import styled from "styled-components";

export default function Mapa(props) {
  return (
    <Container>
      <img src={imagemMapa}></img>
    </Container>
)}




// import GoogleMapReact from "google-map-react";
// import { Wrapper, Status } from "@googlemaps/react-wrapper";
// import { GoogleApiKey } from "../context/local";
// 
// import * as api from '../apis'

// function Mapa(props) {
//   // let v = latlongInput.current.value.replace(',', '')
//   //           let ltlg = {lat: Number(v.split(' ')[0]), lng: Number(v.split(' ')[1])}
//   let latLng = {}

//   let myPos = navigator.geolocation.getCurrentPosition(function (position) {
//      return {lat: position.coords.latitude, lng: position.coords.longitude}
//   })

//   const [map, setMap] = useState(<></>)

//   useEffect(() => 
//     api.getLatLng(props.endereco).then(res => {
//         setMap(
//             <GoogleMapReact
//             bootstrapURLKeys={{ key: GoogleApiKey() }}
//             center={res} zoom={zoom}
//             yesIWantToUseGoogleMapApiInternals
//             onGoogleApiLoaded={({ map, maps }) => 
//             new maps.Marker({position: res, map, title: "Local da entrega.",})
//             }/>
//         )
//         console.log("endereco: ====== ", props.endereco)
//         console.log("resposta da api: ====== ", res)
//         console.log("Mapa criado: ====== ", map)
// }), [])

//   const [zoom, setZoom] = useState(18)

//   const render = (status) => {
//     return <h3>{status}</h3>;
//   };

//   return (
//     <Container
//       onTouchStart={(e) => {
//         e.target.parentElement.focus();
//       }}>

//       <div className="map-container">
//         <Wrapper apiKey={GoogleApiKey()} render={render}>
//          {map}
//         </Wrapper>
//       </div>

//       <div className="zoom-container">
//         <label htmlFor="zoom">Zoom</label>
//         <input type={'number'} placeholder="0-18" defaultValue={zoom} onchange={e => {setZoom(e.target.value)}} />
//       </div>
//     </Container>
//   );
// }

// export default Mapa;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  box-sizing: border-box;
  padding: 2px;
  width: 100%;
  height: 100%;

  img{
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .map-container{
    width: 100%;
    height: 100%;
  }

  .zoom-container{
    width: 100%;
    
    input{width: 100%}
  }


//   @media(max-width: 400px){
//     width: 100%;
//   }

// `
