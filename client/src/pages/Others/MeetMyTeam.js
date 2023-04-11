import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Mohit from '../../assets/mohit.png';
import Amogh from '../../assets/amogh.png';
import Kush from '../../assets/Kush.jpeg';
import Praveen from '../../assets/praveen.jpeg';
import Nikith from '../../assets/nikith3.jpeg';
import styles from './MeetMyTeam.module.css';

export default function MeetMyTeam() {
  return (
    <div>
        <Container style={
            {
                backgroundColor: "#1ABC9C",
            }
        }>
            <Row style={{display: "flex", justifyContent: "center"}} >
                <Col xs={6} md={4}>
                    <div className={styles["our-team"]}>
                        <div className={styles["pic"]}>
                            <img src={Mohit} alt='' />
                        </div>
                        <h3 className={styles["title"]}>Mohit Aswani</h3>
                        <span className={styles["post"]}>Web Developer</span>
                        <ul className={styles["social"]}>
                        </ul>
                    </div>
                </Col>

                <Col xs={6} md={4}>
                    <div className={styles["our-team"]}>
                        <div className={styles["pic"]}>
                            <img src={Kush} alt=''/>
                        </div>
                        <h3 className={styles["title"]}>Kush Gupta</h3>
                        <span className={styles["post"]}>Web Designer</span>
                        <ul className={styles["social"]}>
                        </ul>
                    </div>
                </Col>
        
                <Col xs={6} md={4}>
                    <div className={styles["our-team"]}>
                        <div className={styles["pic"]}>
                            <img src={Amogh} alt='' />
                        </div>
                        <h3 className={styles["title"]}>Amogh Patel</h3>
                        <span className={styles["post"]}>Web Designer</span>
                        <ul className={styles["social"]}>
                        </ul>
                    </div>
                </Col>
            </Row>
            <Row style={{display: "flex", justifyContent: "center"}}>    
                <Col xs={6} md={4}>
                    <div className={styles["our-team"]}>
                        <div className={styles["pic"]}>
                            <img src={Praveen} alt='' />
                        </div>
                        <h3 className={styles["title"]}>Praveen</h3>
                        <span className={styles["post"]}>Web Designer</span>
                        <ul className={styles["social"]}>
                        </ul>
                    </div>
                </Col>

                <Col xs={6} md={4}>
                    <div className={styles["our-team"]}>
                        <div className={`${styles["pic"]} ${styles["rounded-circle"]}`}>
                            <img src={Nikith} alt='' />
                        </div>
                        <h3 className={styles["title"]}>Nikith Chatla</h3>
                        <span className={styles["post"]}>Web Designer</span>
                        <ul className={styles["social"]}>
                        </ul>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}
