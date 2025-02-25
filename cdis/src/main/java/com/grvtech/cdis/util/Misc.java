package com.grvtech.cdis.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

@Service
public class Misc {

	public Misc() {
		super();
		
	}
	
	public String getIpAddr(HttpServletRequest request) {      
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
	
	public ArrayList<String> getHeaderGraphCustomReportPeriod(String period){
		ArrayList<String> result = new ArrayList<>();
		Date today = new Date();  
        Calendar calendar = Calendar.getInstance();  
        calendar.setTime(today);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        //last day of last month
        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		switch (period) {
        	case "6":
        		//last 6 month 
        		for(int i=0;i<6;i++) {
        			calendar.add(Calendar.DATE, -1);
        			result.add(sdf.format(calendar.getTime()));
        			calendar.set(Calendar.DAY_OF_MONTH, 1);
        		}
        		break;
        case "12":
        	//last 12 month 
    		for(int i=0;i<12;i++) {
    			calendar.add(Calendar.DATE, -1);
    			result.add(sdf.format(calendar.getTime()));
    			calendar.set(Calendar.DAY_OF_MONTH, 1);
    		}
    		break;
        case "1":
        	//last year
        	//calendar.set(Calendar.YEAR, -1);
        	calendar.set(Calendar.MONTH, 0);
        	calendar.set(Calendar.DAY_OF_MONTH, 1);
    		for(int i=0;i<12;i++) {
    			calendar.add(Calendar.DATE, -1);
    			result.add(sdf.format(calendar.getTime()));
    			calendar.set(Calendar.DAY_OF_MONTH, 1);
    		}
    		break;
        case "2":
        	//last 2 years
        	//calendar.set(Calendar.YEAR, -1);
        	calendar.set(Calendar.MONTH, 0);
        	calendar.set(Calendar.DAY_OF_MONTH, 1);
    		for(int i=0;i<24;i++) {
    			calendar.add(Calendar.DATE, -1);
    			result.add(sdf.format(calendar.getTime()));
    			calendar.set(Calendar.DAY_OF_MONTH, 1);
    		}
    		break;
        default:
            throw new IllegalArgumentException("Invalid period: " + period);
		}
		return result;
	}
	
	public  String[] push(String[] array, String push) {
	    String[] longer = new String[array.length + 1];
	    for (int i = 0; i < array.length; i++)
	        longer[i] = array[i];
	    longer[array.length] = push;
	    return longer;
	}
	
	
	public  String[] pushArray(String[] array, String[] push) {
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
