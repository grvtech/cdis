/*
 * Created on Aug 24, 2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package com.grvtech.cdis.model;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;

import com.grvtech.cdis.db.CdisDBridge;
import com.grvtech.cdis.db.ChbDBridge;

/**
 * @author radu
 *
 * 
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class User {
	private String username;
	private String password;
	private String firstname;
	private String lastname;
	private String email;
	private String iduser;
	private String phone;
	private String idcommunity;
	private String active;
	private String idprofesion;
	private transient boolean isValid;
	private String reset;
	private String confirmmail;
	
	public User() {
		super();
		username="";
		password="";
		firstname="";
		lastname="";
		email="";
		isValid = false;
		iduser="0";
		phone="";
		idcommunity = "";
		active="1";
		idprofesion="";
		reset="0";
		confirmmail="0";
	
	}
	
	
	
	public User(String username, String password, String firstname,String lastname, String email,String iduser, boolean isValid, String phone, String idcommunity, String active, String idprofesion, String reset, String confirmmail) {
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.isValid = isValid;
		this.iduser = iduser;
		this.phone = phone;
		this.idcommunity = idcommunity;
		this.active = active;
		this.idprofesion = idprofesion;
		this.reset = reset;
		this.confirmmail = confirmmail;
	}



	public void setUser(Map<String, String> mp){
		if(!mp.isEmpty()){
			this.iduser = mp.get("iduser");
			this.username=mp.get("username");
			this.password=mp.get("password");
			this.firstname=mp.get("fname");
			this.lastname=mp.get("lname");
			this.email=mp.get("email");
			this.phone = mp.get("phone");
			this.idcommunity = mp.get("idcommunity");
			this.active = mp.get("active");
			this.isValid = true;
			this.idprofesion = mp.get("idprofesion");
			this.reset = mp.get("reset");
			this.confirmmail = mp.get("confirmmail");
		
		}
	}
	
	private String getLastLogin(){
		ChbDBridge db = new ChbDBridge();
		return db.getLastLogin(this.getIduser());
	}
	
	private HashMap<String, String> getLastPatient(){
		ChbDBridge db = new ChbDBridge();
		return db.getLastPatient(this.getIduser());
	}
	
	private HashMap<String, String> getLastReport(){
		ChbDBridge db = new ChbDBridge();
		return db.getLastReport(this.getIduser());
	}
	
	
	
	
	public String getConfirmmail() {
		return confirmmail;
	}
	public void setConfirmmail(String confirmmail) {
		this.confirmmail = confirmmail;
	}
	
	public String getReset() {
		return reset;
	}
	public void setReset(String reset) {
		this.reset = reset;
	}

	//username
	public String getUsername(){
		return this.username;
	}

	public void setUsername(String username){
		this.username=username;
	}
	
	public String getPhone(){
		return this.phone;
	}
	public void setPhone(String phone){
		this.phone=phone;
	}
	
	public String getIdcommunity(){
		return this.idcommunity;
	}
	public void setIdcommunity(String idcommunity){
		this.idcommunity=idcommunity;
	}
	
	public String getActive(){
		return this.active;
	}
	public void setActive(String active){
		this.active=active;
	}
	
	//password
	public String getPassword(){
		return this.password;
	}
	public void setPassword(String password){
		this.password=password;
	}

	//firstname
	public String getFirstname(){
		return this.firstname;
	}
	public void setFirstname(String firstname){
		this.firstname=firstname;
	}

	//lastname
	public String getLastname(){
		return this.lastname;
	}
	public void setLastname(String lastname){
		this.lastname=lastname;
	}
	
	
	//email
	public String getEmail(){
		return this.email;
	}
	public void setEmail(String email){
		this.email=email;
	}



	public String getIduser() {
		return iduser;
	}
	public void setIduser(String iduser) {
		this.iduser = iduser;
	}

	public String getIdprofesion() {
		return idprofesion;
	}
	public void setIdprofesion(String idprofesion) {
		this.idprofesion = idprofesion;
	}
	
	
	
}
