import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { isMobile, isNEU } from "../util/misc";

export const SearchBar = (props) => {

  function keyDown(e){
    if(e.key === 'ArrowUp' || e.key === 'ArrowDown'){
      e.preventDefault()
    }else if(e.key === 'Enter'){
      props.enterKey && props.enterKey()
    }
  }

  return (
    <Container className={"searchbar-component"}>
      <input
        ref={props._ref}
        id="search-input"
        autoComplete="off"
        type="search"
        placeholder="Digite as palavras-chave da busca..."
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        onFocus={e => props.onFocus && props?.onFocus(e.target.value)}
        onBlur={e => props.onBlur && props?.onBlur(e.target.value)}
        onKeyDown={(e) => keyDown(e)}
        autoFocus={!isMobile()}
      />

      {!isNEU(props.filter) && 
      <button className="filtro" onClick={() => props.filter}>
        <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
      </button>}
    </Container>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  filter: PropTypes.func,
};

const Container = styled.div`
  width: 100%;
  height: 50px;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  padding: 5px 10px;
  gap: 10px;

  input {
    font-size: 18px;
    flex-grow: 2;
    flex-shrink: 2;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid gray;

    &::placeholder {
      font-style: italic;
      user-select: none;
    }
  }

  button {
      background-color: transparent;
      border: none;
      padding: 0 30px;
      font-size: 18px;
      box-sizing: border-box;
      cursor: pointer;

    }

    @media (max-width: 550px){
      height: 60px;
      gap: 1px;

      input {
    font-size: 14px;
  }

      button {
        
        font-size: 22px;
        padding: 10px 20px;
      }
    }

`;
