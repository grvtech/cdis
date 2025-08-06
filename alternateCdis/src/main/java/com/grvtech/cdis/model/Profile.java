package com.grvtech.cdis.model;

import java.util.Date;
import java.util.HashMap;

import com.grvtech.cdis.db.ChbDBridge;

public class Profile {
	private User user;
	private Role role;
	private Cisystem system;
	private Date created;
	
		
	public Profile(HashMap<String, Object> map){
		this.user = (User)map.get("user");
		this.role = (Role)map.get("role");
		this.system = (Cisystem)map.get("system");
		this.created = new Date();
	}

	public Profile(){}

	
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Cisystem getSystem() {
		return system;
	}

	public void setSystem(Cisystem system) {
		this.system = system;
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}
	
	
}
