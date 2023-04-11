import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ContactUs.module.css';
import Shape from '../../assets/shape.png';
import Location from '../../assets/location.png';
import Email from '../../assets/email.png';
import Phone from '../../assets/phone.png';
import Facebook from '../../assets/facebook.svg';
import Twitter from '../../assets/twitter.svg';
import Instagram from '../../assets/instagram.svg';
import LinkedIn from '../../assets/linkedin.svg';

export default function ContactUs() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [message, setMessage] = useState('');

    const onClickHandler = (e) => {
			setName('');
			setEmail('');
			setPhone('');
			setMessage('');
			e.preventDefault();		
    }


  return (
    <div className={styles["container"]}>
      <span className={styles["big-circle"]}></span>
      <img 
        src={Shape} 
        className={styles["square"]} 
        alt="" /> 
      <div className={styles["form"]}>
        <div className={styles["contact-info"]}>
          <h3 className={styles["title"]}>Let's get in touch</h3>
          <p className={styles["text"]}>
            Have any issues with our platform ?
            <br />
            Found a bug ?
            Get in touch with us and we'll fix it ASAP.
          </p>

          <div className={styles["info"]}>
            <div className={styles["information"]}>
              <img 
                src={Location} 
                className={styles["icon"]} 
                alt="" />
              <p>IIIT Sri City, Chittoor, AP, India</p>
            </div>
            <div className={styles["information"]}>
              <img 
                src={Email} 
                className={styles["icon"]} 
                alt="" />
              <p>examplemail@fsd.com</p>
            </div>
            <div className={styles["information"]}>
              <img 
                src={Phone} 
                className={styles["icon"]} 
                alt="" />
              <p>123-456-789</p>
            </div>
          </div>

          <div className={styles["social-media"]}>
            <p>Connect with us :</p>
            <div className={styles["social-icons"]}>
              <a href="https://www.facebook.com/">
                <img src={Facebook} alt="" />
              </a>
              <a href="https://www.twitter.com/">
								<img src={Twitter} alt="" />
              </a>
              <a href="https://www.instagram.com/">
								<img src={Instagram} alt="" />
              </a>
              <a href="https://www.linkedin.com/">
								<img src={LinkedIn} alt="" />
              </a>
            </div>
          </div>
        </div>

        <div className={styles["contact-form"]}>
          <span className={styles["circle one"]}></span>
          <span className={styles["circle two"]}></span>

          <form autocomplete="on" id="my-form">
            <h3 className={styles["title"]}>Contact us</h3>
            <div className={styles["input-container"]}>
              <input 
                type="text"
								value={name} 
                name="name"
								id = "name" 
                className={styles["input"]}
                placeholder="Name" 
								size="40"
								onChange={(e) => setName(e.target.value)}
                required />
            </div>
            <div className={styles["input-container"]}>
              <input 
                type="email" 
								value={email}
                name="email"
								id="email" 
                className={styles["input"]}
                placeholder="Email"
                size="40"
								onChange={(e) => setEmail(e.target.value)}
								required 
                />
            </div>
            <div className={styles["input-container"]}>
              <input 
                type="tel" 
                name="phone"
								value={phone}
								id="phone" 
                className={styles["input"]} 
                placeholder="Phone"
								size="40"
								onChange={(e) => setPhone(e.target.value)}
                required
                />
            </div>
            <div className={`${styles["input-container"]} ${styles["textarea"]}`}>
              <textarea 
                name="message"
								value={message}
								id="message" 
                className={styles["input"]} 
                placeholder="Message"
								onChange={(e) => setMessage(e.target.value)}
								cols="40">
              </textarea>
            </div>
            <input
            	type="submit" 
							value="Send" 
							className={styles["btn"]} 
							onClick={onClickHandler} />
          </form>
        </div>
      </div>
    </div>
  )
}
