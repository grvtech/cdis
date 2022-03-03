package com.grvtech.cdis.util;

import javax.servlet.http.HttpServletRequest;

public class Misc {

	public Misc() {
		super();
		
	}
	
	public static String getIpAddr(HttpServletRequest request) {      
	   String ip = request.getHeader("x-forwarded-for");      
	   if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {      
	       ip = request.getHeader("Proxy-Client-IP");      
	   }      
	   if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {      
	       ip = request.getHeader("WL-Proxy-Client-IP");      
	   }      
	   if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {      
	       ip = request.getRemoteAddr();      
	   }      
	   return ip;      
	  
	} 
	
	
	
	public static String[] push(String[] array, String push) {
	    String[] longer = new String[array.length + 1];
	    for (int i = 0; i < array.length; i++)
	        longer[i] = array[i];
	    longer[array.length] = push;
	    return longer;
	}
	
	
	public static String[] pushArray(String[] array, String[] push) {
	    String[] longer = new String[array.length + push.length];
	    for (int i = 0; i < array.length; i++)
	        longer[i] = array[i];
	    for(int j = 0; j < push.length ; j++)
	    	longer[array.length + j] = push[j];
	    return longer;
	}
	
	
	
	  public String formatDate(String rezDate){
		    String date="";
		    if(rezDate != null && !rezDate.equals("")){
			    String year = rezDate.substring(0,4);
			    //System.out.println("Date string is :"+rezDate);
			    if(!year.equals("1900")){
			    	String day = rezDate.substring(8);
			    	if(day.length() == 1){day = "0"+day;}
			    	String month = rezDate.substring(5,7);
			    	date = year+"/"+month+"/"+day;
			      //date = rezDate.substring(0,4)+"/"+rezDate.substring(5,7)+"/"+rezDate.substring(8,10);
			    }
		    }
		    return date;
		  }

		  public String formatDateShort(String rezDate){
		    String date="";
		    if(rezDate != null && !rezDate.equals("")){
			    String test = rezDate.substring(0,4);
			    if(!test.equals("1900"))
			      date = rezDate.substring(0,4)+"/"+rezDate.substring(5,7);
		  	}
		    return date;
		  }


		  public String formatSmoker(String sm){
		    String rez="Unknown";
		    if(sm.equals("1"))rez="Yes";
		    if(sm.equals("2"))rez="No";
		    return rez;
		  }
		  public String formatFoot(String sm){
		    String rez="Unknown";
		    if(sm.equals("1"))rez="Done";
		    if(sm.equals("0"))rez=" Not done";
		    return rez;
		  }
		  public String formatInh(String sm){
		    String rez="Unknown";
		    if(sm.equals("0") || sm==null)rez="No";
		    if(sm.equals("1") || sm==null)rez="Yes";
		    return rez;
		  }
		  public String formatPsyco(String sm){
		    String rez="Unknown";
		    if(sm.equals("1"))rez="Done";
		    if(sm.equals("0"))rez="Not done";
		    return rez;
		  }
		  
		  public String formatYesNoUnknown(int num){
			  String rez="No";
			  if(num == 0)rez="No";
			  if(num == 1)rez="Yes";
			  if(num == 2)rez="Unknown";
			  return rez;
		  }


}
