import React from 'react';

import './SignUp.sass';

class SignUp extends React.PureComponent {

  state = {
    dataReady: true,
    Name: "",
    NameControl: false,
    Email: "",
    EmailControl: false,
    Phone: "",
    PhoneControl: false,
    BirthDay: "",
    BirthDayControl: false,
    TextMessage: "",
    TextMessageControl: false,
    formVisible: true,
    infoUser: null,

}

NameAdd = (EO) => {
  EO.target.value=EO.target.value.toUpperCase();
  EO.target.value=EO.target.value.replace(/\s+/g, " ");
  this.setState( {Name:EO.target.value}, this.NameAddFunc);
}

NameAddFunc = () => {
  if(/^\b[A-Z]{3,30}\b\s{1}?\b[A-Z]{3,30}\b$/.test(this.state.Name)) {
    this.setState( {NameControl: false });
    return true;
  }else {
    this.setState( {NameControl: true });
    return false;
  }
}

EmailAdd = (EO) => {
  this.setState( {Email:EO.target.value},  this.EmailAddFunc);

}

EmailAddFunc = () => {
  if(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(this.state.Email)) {
    this.setState( {EmailControl:false} );
    return true;
  } else {
    this.setState( {EmailControl:true});
    return false;
  }
}

PhoneAdd = (EO) => {
  EO.target.value=EO.target.value.replace(/\D/g, "");
  let numberPhone = EO.target.value;
  let formattedInputValue = " ";

  let firstSimbol = numberPhone[0]==="7"?"+7":`+7${numberPhone[0]?numberPhone[0]:""}`;
  formattedInputValue = firstSimbol + " ";
  if(numberPhone.length > 1) {
    formattedInputValue += "(" + numberPhone.substring(1, 4);
  }
  if(numberPhone.length >= 5) {
    formattedInputValue += ") " + numberPhone.substring(4, 7);
  }
  if(numberPhone.length >= 8) {
    formattedInputValue += "-" + numberPhone.substring(7, 9);
  }
  if(numberPhone.length >= 10) {
      formattedInputValue += "-" + numberPhone.substring(9, 11);
  }
  EO.target.value = formattedInputValue; 
    
  this.setState( {Phone: formattedInputValue}, this.PhoneAddFunc );
  
}

PhoneAddFunc = () => {
  if(/\+7\s\(\d\d\d\)\s\d\d\d-\d\d-\d\d/.test(this.state.Phone)) {
    this.setState( {PhoneControl:false} );
    return true;
  } else {
    this.setState( {PhoneControl:true});
    return false;
  }
}

CleanSeven = (EO) => {
  if(EO.keyCode === 8 && EO.target.value.length === 3) EO.target.value = "";
}


BirthDayAdd = (EO) => {
  this.setState( {BirthDay:EO.target.value},  this.BirthDayAddFunc);
}

BirthDayAddFunc = () => {
  if(this.state.BirthDay) {
    this.setState( {BirthDayControl: false });
    return true;
  }else {
    this.setState( {BirthDayControl: true });
    return false;
  }
}


TextMessageAdd = (EO) => {
  this.setState( {TextMessage:EO.target.value},  this.TextMessageAddFunc);

}

TextMessageAddFunc = () => {
  if(/.{10,300}/.test(this.state.TextMessage)&&this.state.TextMessage.length<301) {
    this.setState( {TextMessageControl: false });
    return true;
  }else {
    this.setState( {TextMessageControl: true });
    return false;
  }
}

submitForm = () =>{
  if(this.state.dataReady) {
    let arrValidateFunction = [
      this.NameAddFunc,
      this.EmailAddFunc,
      this.PhoneAddFunc,
      this.BirthDayAddFunc,
      this.TextMessageAddFunc
    ];
    let copy = [...arrValidateFunction];
    if(copy.filter(func=>func()).length !== 5) {
        console.log('Not ok validate form');
        
    } 
    else  {
        this.setState( {dataReady: false});
        console.log('Ok validate form');
        this.postForm();
    } 
  }

}


postForm = async () => {
  
    const USERS_URL = 'https://play-app-hurry.herokuapp.com/api/play'
    
    let data = {
        nameUser: `${this.state.Name}, ${this.state.Email}, ${this.state.Phone}, ${this.state.BirthDay}, ${this.state.TextMessage}`,
        country: "",
        town: "",
        mail: "",
        password: "",
        counter: 1
      }

    const settings = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }
    

    try{

        const response = await fetch (USERS_URL, settings);
        const data = await response.json();
        console.log("SEND SUCCESSFULLY");
        console.log(data);
        this.setState( {formVisible: false, Name: "", Email: "", Phone: "", BirthDay: "", TextMessage: "", dataReady: true});
        
    } catch (e) {
        console.log("SEND NOT SUCCESSFULLY", e);
        this.setState( {dataReady: true});
    
  }

}

  render() {

    return (
      <div>
        <div  action="#" noValidate className='form-sign-up'>
          <div className="clearfix">
              <label id="label-name" htmlFor="name">Имя Фамилия</label>
              <div className="registration"><input  id="name" type="text" value={this.state.Name} name="nameUser" onChange={this.NameAdd} onBlur={this.NameAdd}></input>
                {
                  this.state.NameControl&&
                  <div className="ErrorValid">Имя и фамилия должны содержать не менее 3 и не более 30 знаков латинского алфавита, между словами может быть один пробел.</div>
                }
              </div>
          </div>

          <div className="clearfix">
              <label id="label-e-mail-up" htmlFor="e-mail-up">Ваш e-mail:</label>
              <div className="registration"><input  id="e-mail-up" type="text" value={this.state.Email} name="mail" onChange={this.EmailAdd} onBlur={this.EmailAdd}></input>
                  {
                    this.state.EmailControl&&
                    <div className="ErrorValid">E-mail не валидный.</div>
                  }
              </div>
          </div>
          <div className="clearfix">
              <label id="label-phone" htmlFor="phone">Номер телефона</label>
              <div className="registration"><input  id="phone" type="tel" value={this.state.Phone} name="phone" maxLength={18}  onChange={this.PhoneAdd} onBlur={this.PhoneAdd} onKeyDown={this.CleanSeven} ></input>
                  {
                    this.state.PhoneControl&&
                    <div className="ErrorValid">Введите корректно российский номер телефона.</div>
                  }
              </div>
          </div>
          <div className="clearfix">
              <label id="label-birth" htmlFor="birth">Дата рождения</label>
              <div className="registration"><input  id="birth" type="date" value={this.state.BirthDay} name="birth"  onChange={this.BirthDayAdd} onBlur={this.BirthDayAdd}></input>
                  {
                    this.state.BirthDayControl&&
                    <div className="ErrorValid">Поле не должно быть пустым.</div>
                  }
              </div>
          </div>
          <div className="clearfix">
              <label id="label-text-message" htmlFor="text-message">Сообщение</label>
              <div className="registration"><input  id="text-message" type="text" value={this.state.TextMessage} maxLength={300} name="message"  onChange={this.TextMessageAdd} onBlur={this.TextMessageAdd}></input>
                  {
                    this.state.TextMessageControl&&
                    <div className="ErrorValid">Не менее 10 и не более 300 символов</div>
                  }
              </div>
          </div>
          <button id="submit" type="submit" className="ButtonIn" onClick={this.submitForm} >Зарегистрироваться</button>
        </div>
        {
          !this.state.formVisible&&
          <h2 className='Registr'>Ваши данные успешно отправлены на сервер.</h2>
        }
      </div>
      
    );
  }
}



export default SignUp;