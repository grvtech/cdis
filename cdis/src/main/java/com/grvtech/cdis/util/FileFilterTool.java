/*
 * Created on Dec 1, 2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package com.grvtech.cdis.util;

import java.io.File;
import java.io.FilenameFilter;

/**
 * @author radu
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class FileFilterTool implements FilenameFilter {

	private String filter;
	private String prefix;
	
	public FileFilterTool() {
		super();
	}
	
	public FileFilterTool(String filter) {
		this.filter = filter;
		this.prefix="";
	}
	
	public FileFilterTool(String filter, String prefix) {
		this.filter = filter;
		this.prefix = prefix;
	}
	
	
	public boolean accept(File arg0, String arg1) {
		if(this.filter == null && this.prefix==null)
			return (arg1.endsWith(".txt"));
		else
			return (arg1.endsWith(filter) && arg1.startsWith(prefix));
	}


}
