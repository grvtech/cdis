package com.grvtech.cdis.controler;

import java.util.ArrayList;
import java.util.HashMap;

import com.grvtech.cdis.db.CdisDBridge;
import com.grvtech.cdis.model.Report;

public class Reports {
	
	/*
	 * Reports 
	 * predefined reports
	 *  number of patients of diabet per comunity (all) (community) by sex and by age  System
	 *  types of diabet in comunities per community (all) (community)  System
	 *  new cases of diabet by year by community (all) (community) System
	 *  number of patients with complications by community (all) (community) System 
	 * 
	 * admin reports
	 *  user activity by activity and per month  System
	 *  import from Omnilab report daily (last 10 reports) System
	 *  export all data per section (lab, mdvisits, renal, lipid, ) per year
	 *  
	 *  
	 *  
	 * ROOT
	 *     - predefined reports
	 *     - admin reports
	 *     - personal reports
	 * USER
	 *    - predefined reports per community 
	 *    - personal reports 
	 * 
	 * */
	
	
	
	/*
	public static ArrayList<Report> getPredefinedReports(String iduser, String community){
		ArrayList<Report> result = new ArrayList<>();
		CdisDBridge db = new CdisDBridge();
		result = db.getReports(iduser, community,"REP");
		return result;
	}
	
	
	public static ArrayList<Report> getListsReports(String iduser, String community){
		ArrayList<Report> result = new ArrayList<>();
		CdisDBridge db = new CdisDBridge();
		result = db.getReports(iduser, community,"LIST");
		return result;
	}
	
	
	public static ArrayList<Report> getPersonalReports(String iduser, String community, String userRole){
		ArrayList<Report> result = new ArrayList<>();
		CdisDBridge db = new CdisDBridge();
		if(userRole.equals("ROOT")){
			result = db.getReports(iduser, "0","PERSONAL");
		}else{
			result = db.getReports(iduser, community,"PERSONAL");
		}
		return result;
	}
	
	public static ArrayList<Report> getAdminReports(){
		ArrayList<Report> result = new ArrayList<>();
		CdisDBridge db = new CdisDBridge();
		result = db.getReports("1", "0", "ADMIN");
		return result;
	}
	
	*/
}
