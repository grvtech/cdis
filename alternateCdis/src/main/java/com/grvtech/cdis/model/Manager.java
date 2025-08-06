package com.grvtech.cdis.model;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.CharacterIterator;
import java.text.StringCharacterIterator;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.GregorianCalendar;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.sql.DataSource;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;


import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;



public class Manager {
	
	DataSource dataSource = null;
	static String[] columns = {"idcommunity","ramq","chart","band","sex","height","dob","deceased","dcause","dod","modifydate","entrydate","native","medic_name","nurse_name","nutritionist_name"};
	static String[] dcolumns ={"idpatient","ramq","iddiabetype","dateonset"};
	static String[] dtypes ={" ","Type 1 DM","Type 2 DM","Glucose Intolerance","Gestational Diabetes","IFG","IGT","GDM","IGT in pregnancy","IGT+IFG"};
	static String[] comunities = {" ","chisasibi","eastmain","mistissini","nemaska","oujebougoumou","waskaganish","waswanipi","wemindji","whapmagoostui","non-cree community"};
	static Object[] exeps = {"idcommunity", "dob", "dod", "modifydate", "entrydate","dateonset","iddiabetype","idpatient","datemdvisits","daterenal","datelipid","datelab","dateophta","dateinfluenza","datepneu","dateppd","reti","lther","lblind","micro","macro","renf","dial","neuro","fulcer","amput","impot","cad","cvd","pvd","native"};
	static String[] legend = {"idcommunity","iddiabetype","smoker","sex","deceased","native","inh","foot","insulin","orala","acei","statin","asa"};
	
	
	
	public Manager() {
	}
	public Manager(DataSource data) {
		this.dataSource = data;
	}

	public String getLogDir(){
		String result = new String();
		String rootPath = new String();
		Context initContext;
		try {
			initContext = new InitialContext();
			Context envContext  = (Context)initContext.lookup("java:comp/env");
			result = (String)envContext.lookup("log-dir");
			rootPath = (String)envContext.lookup("root-folder");
		} catch (NamingException e1) {
			e1.printStackTrace();
		}
		return rootPath+result;
	}
	
	public File getLogFile(String fileName){
		return new File(getLogDir()+"/"+fileName);
	}
	

	public String getProperty(String propertyName){
		Context initContext;
		String rootPath="";
		String pathfile="";
		try {
			initContext = new InitialContext();
			Context envContext  = (Context)initContext.lookup("java:comp/env");
			pathfile = (String)envContext.lookup("config-file");
			rootPath = (String)envContext.lookup("root-folder");
			
		} catch (NamingException e1) {
			e1.printStackTrace();
		}
	  	File fl = new File(rootPath+pathfile);
	  	String message="";
	  		try {
				BufferedReader br = new BufferedReader(new FileReader(fl));
				while(br.ready()){
					String line = br.readLine();
					if(line.indexOf(";") != 0){
						int separatorIndex = line.indexOf("=");
						String token = line.substring(0,separatorIndex);
						if(token.equals(propertyName)){
							message = line.substring(separatorIndex+1);
							break;
						}
					}
				}
				br.close();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
	  	return message;
	  }
	
	public String getConfigProperty(String propertyName){
		Context initContext;
		String rootPath="";
		String pathfile="";
		try {
			initContext = new InitialContext();
			Context envContext  = (Context)initContext.lookup("java:comp/env");
			pathfile = (String)envContext.lookup("config-dir");
			rootPath = (String)envContext.lookup("root-folder");
		} catch (NamingException e1) {
			e1.printStackTrace();
		}
	  	File fl = new File(rootPath+pathfile+"cdis.config");
	  	String message="";
	  		try {
				BufferedReader br = new BufferedReader(new FileReader(fl));
				while(br.ready()){
					String line = br.readLine();
					if(line.indexOf(";") != 0){
						int separatorIndex = line.indexOf("=");
						int pointIndex = line.indexOf(".");
						int barIndex = line.indexOf("|");
						String token = line.substring(0,pointIndex);
						if(token.equals(propertyName)){
							if(barIndex > 0 ){
								message = line.substring(separatorIndex+1,barIndex);
							}else{
								message = line.substring(separatorIndex+1);
							}
							break;
						}
					}
				}
				br.close();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
	  	return message;
	  }
	
	public String getMessage(){
		Context initContext;
		String rootPath="";
		String pathfile="";
		try {
			initContext = new InitialContext();
			Context envContext  = (Context)initContext.lookup("java:comp/env");
			pathfile = (String)envContext.lookup("message-file");
			rootPath = (String)envContext.lookup("root-folder");
		} catch (NamingException e1) {
			e1.printStackTrace();
		}
	  	File fl = new File(rootPath+pathfile);
	  	String message="";
	  		try {
				BufferedReader br = new BufferedReader(new FileReader(fl));
				while(br.ready()){
					String line = br.readLine();
					message+=line;
				}
				br.close();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
	  	return message;
	  }

	public void setMessage(String message){
		Context initContext;
		String rootPath="";
		String pathfile="";
		try {
			initContext = new InitialContext();
			Context envContext  = (Context)initContext.lookup("java:comp/env");
			pathfile = (String)envContext.lookup("message-file");
			rootPath = (String)envContext.lookup("root-folder");
		} catch (NamingException e1) {
			e1.printStackTrace();
		}
	  	File fl = new File(rootPath+pathfile);
  		try {
  			if(fl.exists()){
				BufferedWriter bw = new BufferedWriter(new FileWriter(fl));
				bw.write(message);
				bw.close();
			}
  		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
  }

	
	
	@SuppressWarnings("unchecked")
	public Hashtable getValidations(String key){
		Context initContext;
		String rootPath="";
		String pathfile="";
		try {
			initContext = new InitialContext();
			Context envContext  = (Context)initContext.lookup("java:comp/env");
			pathfile = (String)envContext.lookup("validation-file");
			rootPath = (String)envContext.lookup("root-folder");
		} catch (NamingException e1) {
			e1.printStackTrace();
		}
	  	File fl = new File(rootPath+pathfile);
	  	Hashtable validations= new Hashtable();
	  		try {
				BufferedReader br = new BufferedReader(new FileReader(fl));
				while(br.ready()){
					String line = br.readLine();
					if(line.indexOf(";") != 0){
						int separatorIndex = line.indexOf("=");
						String token = line.substring(0,separatorIndex);
						String message = line.substring(separatorIndex+1);
						String[] tags = token.split("\\.");
						if(tags[0].equals(key)){
							validations.put(tags[1],message);
						}
					}
				}
				br.close();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
	  	return validations;
	  }
	
	
	
	@SuppressWarnings("unchecked")
	public String postData(String urlStr, Map params){
		URL url = null;
	    URLConnection urlConn;
	    DataOutputStream  printout;
	    String result = "";
	    try {
			url = new URL(urlStr);
			//URL connection channel.
			urlConn = url.openConnection();
			urlConn.setDoInput (true);
		    //Let the RTS know that we want to do output.
		    urlConn.setDoOutput (true);
		    //No caching, we want the real thing.
		    urlConn.setUseCaches (false);
		    //Specify the content type.
		    urlConn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
		    //Send POST output.
			printout = new DataOutputStream (urlConn.getOutputStream ());
			
			Enumeration keys = (new Hashtable(params)).keys();
			String content = "";
			while(keys.hasMoreElements()){
				String key = (String)keys.nextElement();
			    content += key+"="+URLEncoder.encode((String)params.get(key),"UTF-8")+"&";
			}   
			content+="post_date="+(Calendar.MILLISECOND);
		    printout.writeBytes (content);
		    printout.flush ();
		    printout.close ();
		    
		    BufferedReader d = new BufferedReader(new InputStreamReader(urlConn.getInputStream ()));
		    
		    while(d.ready()){
		    	result+=d.readLine();
		    }
		    
	    } catch (IOException e1) {
			e1.printStackTrace();
		}
	    return result;
	}
	
	
	
	
	
	 public static String forRegex(String aRegexFragment){
		    final StringBuffer result = new StringBuffer();

		    final StringCharacterIterator iterator = new StringCharacterIterator(aRegexFragment);
		    char character =  iterator.current();
		    while (character != CharacterIterator.DONE){
		      /*
		      * All literals need to have backslashes doubled.
		      
		      if (character == '.') {
		        result.append("\\.");
		      }
		      else if (character == '\\') {
		        result.append("\\\\");
		      }
		      else if (character == '?') {
		        result.append("\\?");
		      }
		      else if (character == '*') {
		        result.append("\\*");
		      }
		      else if (character == '+') {
		        result.append("\\+");
		      }
		      else if (character == '&') {
		        result.append("\\&");
		      }
		      else if (character == ':') {
		        result.append("\\:");
		      }
		      else if (character == '{') {
		        result.append("\\{");
		      }
		      else if (character == '}') {
		        result.append("\\}");
		      }
		      else if (character == '[') {
		        result.append("\\[");
		      }
		      else if (character == ']') {
		        result.append("\\]");
		      }
		      else if (character == '(') {
		        result.append("\\(");
		      }
		      else if (character == ')') {
		        result.append("\\)");
		      }
		      else if (character == '^') {
		        result.append("\\^");
		      }
		      else if (character == '$') {
		        result.append("\\$");
		      }
		      else if (character == '\'') {
			    result.append("\\'");
			  }
		      else {
		        //the char is not a special one
		        //add it to the result as is
		        result.append(character);
		      }
		      */
		      if (character == '\\') {
		        result.append("\'\\");
		      }
		      else if (character == '\'') {
			    result.append("\'\'");
			  }else {
		        //the char is not a special one
		        //add it to the result as is
		        result.append(character);
		      }
	    	  character = iterator.next();
		    }
		    return (result.toString()).trim();
		  }
	 
	 @SuppressWarnings("unchecked")
	public Hashtable formatPostValues(Hashtable pv){
		 Hashtable result = new Hashtable();
		 if(!pv.isEmpty()){
			 Enumeration keys = pv.keys();
			 while(keys.hasMoreElements()){
				 String key = (String)keys.nextElement();
				 String[] vals = (String[])pv.get(key);
				 String value = "";
				 if(vals.length > 1){
					String delim = "|";
					for(int i=0;i<vals.length;i++){
						if(i==(vals.length-1))delim="";
						value+=vals[i]+delim;
					}
				 }else{
					 value=vals[0];
				 }
				 result.put(key, value);
			 }
		 }
		 return result;
	 }
	 
	 
	 @SuppressWarnings("unchecked")
	public String getValueOfField(String fieldName,Hashtable postValues){
			String result = "";
			List exceptions = Arrays.asList(exeps);
			if(exceptions.contains(fieldName)){
				result = getExeptionValueOfField(fieldName,postValues);
			}else{
				result = (String)postValues.get(fieldName+"_control");
				if((result==null) || (result.equals("null"))){result="";}
			}
			return result;
		}
	 
	 public String getValueofColumn(String columnName, String columnValue){
		 String result = columnValue;
		 if((columnValue == null) || (columnValue.indexOf("01/01/1900") >= 0)){
			 result = "null";
		 }
		 List l = Arrays.asList(legend);
		 int index = l.indexOf(columnName);
		 if(index >= 0){
			 result = getValueOfLegend(index, columnValue);
		 }
		 return result;
	 }
	 
	 public String getValueOfLegend(int idSection, String idField){
		 Context initContext;
		 String result = "";
		 try {
				initContext = new InitialContext();
				Context envContext  = (Context)initContext.lookup("java:comp/env");
				String pathfile = "/WEB-INF/config/legend.xml";
				String rootPath = (String)envContext.lookup("root-folder");
				File f = new File(rootPath+pathfile);
				DocumentBuilderFactory dbfac = DocumentBuilderFactory.newInstance();
				DocumentBuilder docBuilder = null;
				docBuilder = dbfac.newDocumentBuilder();
	            Document doc = docBuilder.parse(f);
	            Element root = doc.getDocumentElement();
	            NodeList sections = root.getElementsByTagName("section");
	            Element section = (Element)sections.item(idSection);
	            NodeList items = section.getElementsByTagName("item");
	            for(int i=0;i<items.getLength();i++){
	            	Element item = (Element)items.item(i);
	            	if(item.getAttribute("id").equals(idField)){
	            		result = item.getFirstChild().getNodeValue();
	            		break;
	            	}
	            }
			}catch (Exception e) {
				e.printStackTrace();
			}
		 return result;
	 }
		
		@SuppressWarnings("unchecked")
		public String getExeptionValueOfField(String fieldName,Hashtable postValues){
			Context initContext;
			DataSource ds;
			String result = "";
			//List exceptions = Arrays.asList(exeps);
			List coms = Arrays.asList(comunities);
			if(fieldName.equals("idcommunity")){
				try {
					int index = coms.indexOf(URLDecoder.decode(((String)postValues.get("community_control")).toLowerCase(),"UTF-8"));
					if(index < 0) index = 0; 
					result = Integer.toString(index);
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
				}
			}else if(fieldName.equals("modifydate") || fieldName.equals("entrydate")){
				Calendar calendar = new GregorianCalendar();
				Date trialTime = new Date();
				calendar.setTime(trialTime);
				result = calendar.get(Calendar.YEAR)+"/"+(calendar.get(Calendar.MONTH)+1)+"/"+calendar.get(Calendar.DAY_OF_MONTH); 
			}else if(fieldName.equals("idpatient")){
				try {
					initContext = new InitialContext();
					Context envContext  = (Context)initContext.lookup("java:comp/env");
					ds = (DataSource)envContext.lookup("jdbc/cdis");
					Connection conn = ds.getConnection();
					Statement stat = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_UPDATABLE);
					String lastID = "SELECT IDENT_CURRENT('cdis_patient')";
					ResultSet res = stat.executeQuery(lastID);
					if(res.isBeforeFirst()){
						res.next();
						result = res.getString(1);
					}
					stat.close();
					conn.close();
				}catch (Exception e) {
					e.printStackTrace();
				} 
			}else if(fieldName.equals("iddiabetype")){
				List dt = Arrays.asList(dtypes);
				try {
					result = Integer.toString(dt.indexOf(URLDecoder.decode((String)postValues.get("type_control"),"UTF-8")));
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
					result="1";
				} 
			}else if(fieldName.equals("dateonset")){
				result = (String)postValues.get("date_year_control")+"/"+(String)postValues.get("date_month_control")+"/"+(String)postValues.get("date_day_control"); 
			}else if(fieldName.equals("native")){
				result = (String)postValues.get("cree_control"); 
			}else{
				String year = (String)postValues.get(fieldName+"_year_control");
				String month = (String)postValues.get(fieldName+"_month_control");
				String day = (String)postValues.get(fieldName+"_day_control");
				result = year+"/"+month+"/"+day;
			}
			if((result==null) || (result.equals("null"))){result="";}
			return result;
		}
	 
		
		@SuppressWarnings("unchecked")
		public Hashtable formatPostVars(Hashtable vr){
			Hashtable rez = new Hashtable();
			String sep = "|";
			Enumeration enu = vr.keys();
			while(enu.hasMoreElements()){
				Object elm = enu.nextElement();
				Object[] vals = (Object[])vr.get(elm);
				if(vals.length > 1){
					String val = "";
					for(int j=0;j<vals.length;j++){
						if(j == vals.length-1){
							if(!((String)vals[j]).trim().equals("")){
								val+= (String)vals[j];
							}else{
								if(val.indexOf(sep) > 0){
									val = val.substring(0, val.lastIndexOf(sep));
								}
							}
						}else{
							if(!((String)vals[j]).trim().equals(""))
								val+= (String)vals[j]+sep;
						}
					}
					rez.put(elm,val);
				}else
					rez.put(elm,((String[])vr.get(elm))[0]);
			}
			return rez;
		}
		
		
		
		public Element getField(String id,Element root){
			Element field = null;
			for(int i=0;i<root.getChildNodes().getLength();i++){
				Node nod = root.getChildNodes().item(i);
				if(nod.getNodeType()==Node.ELEMENT_NODE){
					Element elm = (Element)nod;
					if(elm.getTagName().equals("table")){
						NodeList elms = elm.getChildNodes();
						for(int j=0;j<elms.getLength();j++){
							if(elms.item(j).getNodeType() == Node.ELEMENT_NODE){
								Element l = (Element)elms.item(j);
								if(l.getAttribute("id").equals(id)){
									field = l;
								}
							}
						}
					}
				}
			}
			return field;
		}
		
		
		@SuppressWarnings("unchecked")
		public Vector getFields(Element root){
			Vector result = new Vector();
			for(int i=0;i<root.getChildNodes().getLength();i++){
				Node nod = root.getChildNodes().item(i);
				if(nod.getNodeType()==Node.ELEMENT_NODE){
					Element elm = (Element)nod;
					if(elm.getTagName().equals("table")){
						NodeList elms = elm.getChildNodes();
						for(int j=0;j<elms.getLength();j++){
							if(elms.item(j).getNodeType() == Node.ELEMENT_NODE){
								Element l = (Element)elms.item(j);
								result.add(l);
							}
						}
					}
					
				}
			}
			return result;
		}
		
		public String getOperator(String op){
			String operator = "=";
			if(op.equals("1")){
				operator = "<";
			}else if(op.equals("2")){
				operator = ">";
			}else{
				operator = "=";
			}
			return operator;
		}
		
		
		// Returns the contents of the file in a byte array.
	    public static byte[] getBytesFromFile(File file) throws IOException {
	        InputStream is = new FileInputStream(file);
	    
	        // Get the size of the file
	        long length = file.length();
	    
	        // You cannot create an array using a long type.
	        // It needs to be an int type.
	        // Before converting to an int type, check
	        // to ensure that file is not larger than Integer.MAX_VALUE.
	        if (length > Integer.MAX_VALUE) {
	            // File is too large
	        }
	    
	        // Create the byte array to hold the data
	        byte[] bytes = new byte[(int)length];
	    
	        // Read in the bytes
	        int offset = 0;
	        int numRead = 0;
	        while (offset < bytes.length
	               && (numRead=is.read(bytes, offset, bytes.length-offset)) >= 0) {
	            offset += numRead;
	        }
	    
	        // Ensure all the bytes have been read in
	        if (offset < bytes.length) {
	            throw new IOException("Could not completely read file "+file.getName());
	        }
	    
	        // Close the input stream and return bytes
	        is.close();
	        return bytes;
	    }
}
