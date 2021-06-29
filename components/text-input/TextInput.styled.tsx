import styled from "@emotion/styled";

export const StyledInput = styled.div`
  display: flex;
  flex-direction: column;
  label {
    width: 100%;
    padding-left: 4px;
    margin-bottom: 1rem;
    font-weight: 400;
    font-size: 16px;
  }
  input {
    min-height: 25px;
    width: 250px;
    background-color: #f4f5f4;
    padding: 1rem 1.25rem;
    &:focus {
      background-color: #fff;
      color: #ff4d4c;
      outline-color: #ff4d4c;
    }
  }
`;
