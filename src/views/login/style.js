import styled from 'styled-components';

export const Container = styled.div`
  background-color: #d2dae2;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
  overflow: hidden;



  img{
          width: 150px;
          margin-bottom: 20px;
          
      }

  .container{
      color: white;
      background-color: #1e272e;
      width: 400px;
      height: 400px;
      box-sizing: border-box;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, .5);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      padding: 10px;

    h1{
        text-align: center;
        width: 100%;
    }
      form{
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;

        .form-input{
          box-sizing: border-box;
          margin-bottom: 10px;
          padding: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: white;
          width: 100%;
          

          label{
              font-size: 14px;
              width: 80px;
          }

          input{
              color: white;
              background-color: transparent;
              outline: none;
              border-width: 0 0 2px;
              border-color: white;
              font-size: 20px;
              transition: .8s;
              width: 100%;

              &:focus{
                color: yellow;
                border-color: yellow;
              }
            }
          
        }

        .keep-connected-container{
            /* margin-bottom: 30px; */
        }

        button{
              margin: auto;
              width: 90%;
              height: 60px;
              font-size: 15px;
              cursor: pointer;
              box-shadow: none;
              outline: none;
              border: none;
              border-radius: 30px;

          }
    }


  }

  @media (max-width: 550px){

    img{
        width: 40%;
    }

      .container{
          width: 85%;
          height: 400px;
      }
  }
`;
