var userS = userSearch;
var mailT = mailToUrl;
function Android () {
	
	this.addusersearch = function() {
		$("input[type=submit]").each(function(i,v) {
			$(v).addClass("btn-primary-small padding-y-small");
		});	
	};

	this.modPanel = function() {
		$.ajax({
			url : userS,
			type: "GET",
			success: function(data, textStatus, jqXHR)
			{
				var formuser = $(data).find(".adminBox form")[1];
				var formip = $(data).find(".adminBox form")[2];
				$(formip).find('input[type=submit]').attr('class', 'btn-primary-small padding-y-small searchip').attr('value','suche');
				$(formip).find('.searchip').css('width',"100%");
				$(formip).find('label').css('display',"none");
				$(formip).find('input#searchIpAddress').attr('size',"");
				$(formip).find('input#searchIpAddress').css('width',"100%");
				$(formip).find('input#searchIpAddress').attr('placeholder',"IP-Adresse");
				$(formuser).find('input[type=submit]').attr('class', 'btn-primary-small padding-y-small searchuser').attr('value','suche');
				$(formuser).find('.searchuser').css('width',"100%");
				$(formuser).find('label').css('display',"none");
				$(formuser).find('input#searchName').attr('size',"");
				$(formuser).find('input#searchName').css('width',"100%");
				$(formuser).find('input#searchName').attr('placeholder',"Username");
				$("body").append('<gcse:searchresults></gcse:searchresults>');
				if (tld == "de") {
					$(".forumSidebar").prepend('<section class="forumSidebox searchip"><h2>Mod Panel</h2><ul><li class="forumSideboxItem"><form action="' + userSearch + '" method="post">'+$(formip).html()+'</form></li><li class="forumSideboxItem"><form action="' + userSearch + '" method="post">'+$(formuser).html()+'</form></li><li class="forumSideboxItem"><gcse:searchbox></gcse:searchbox></li></ul></section>');
				} else {
					$(".forumSidebar").prepend('<section class="forumSidebox searchip"><h2>Mod Panel</h2><ul><li class="forumSideboxItem"><form action="' + userSearch + '" method="post">'+$(formip).html()+'</form></li><li class="forumSideboxItem"><form action="' + userSearch + '" method="post">'+$(formuser).html()+'</form></li></ul></section>');
				}
				var script = document.createElement('script');
				script.text = '(function() {var cx = "006006678927633944778:-li7chryqxa";var gcse = document.createElement("script");gcse.type = "text/javascript";gcse.async = true;gcse.src = (document.location.protocol == "https:" ? "https:" : "http:") + "//cse.google.com/cse.js?cx=" + cx;var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(gcse, s);})();';
				document.getElementsByTagName('head')[0].appendChild(script);
			},
			error: function (jqXHR, textStatus, errorThrown) {}
		});
	};
	
	this.usersearch = function() {
		$(".powerbarLinks").append('<a href="' + userSearch + '">Manage user</a>');
		$(".navTopLeft").append('<a href="' + userSearch + '" class="navTopLeftLink"><span>Manage user</span></a>');
	};
	
	this.signaturFix = function() {
		console.log("Fix Signatur");
		$('.threadPostContentSignature>p').css('font-size', '1.0rem');
		$('.threadPostContentSignature>p').css('line-height', '1.0rem');
	};
	
	this.magazinButtonFix = function() {
		$('.btn-secondary').css('min-width','0');
		$('.btn-secondary').css('font-size', '1.4rem');
	};
	
	this.zitate = function() {
		$('blockquote').before('<p class="spoiler">Spoiler</p>');
		$('blockquote').css('display','none');
		$( "body" ).delegate( "p.spoiler", "click", function() {
			$(this).next().slideToggle("slow");
		});
	};
    
    this.powerBar = function() {
    	$('.headerMain, .headerMain-forum').css('margin-top', '30px');
    	$('.powerbarContainer').css('position', 'fixed').css('margin-top', '-30px').css('z-index', '1000').css('width', '100%');
    };
    
    this.top = function() {
		$( document ).ready(function() {
			$('.forumThreadListPageLabelFixed, .instantScrollAnchor, .forumThreadListPageLabelFixedInside').remove();
			$("body").append('<a href="#0" class="cd-top" style="border-radius: 50px; z-index: 100; left: 50%;">Top</a>');
			var offset = 35, //300
			offset_opacity = 1200,
			scroll_top_duration = 700,
			$back_to_top = $('.cd-top');

			$(window).scroll(function(){
				( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
				if( $(this).scrollTop() > offset_opacity ) { 
					$back_to_top.addClass('cd-fade-out');
				}
			});

			$back_to_top.on('click', function(event){
				event.preventDefault();
				$('body,html').animate({
					scrollTop: 0 ,
					}, scroll_top_duration
				);
			});
			$.ajax({
				url: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/css/web/backToTop.css',
				dataType: 'text',
				success: function(data) {
					$('<style type="text/css">\n' + data + '</style>').appendTo("head");
				}                  
			});
		})
    };
    
    this.getInfo = function() {
        this.chrome();
        //this.zitate();
        this.signaturFix();
        this.magazinButtonFix();
        this.top();
        this.powerBar();
		this.usersearch();
        $.ajax({
			url: 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/javascript/web/mod_modi_web.js',
			type: "GET",
			contentType: 'text/javascript',
			cache: false,
			success: function (data, status, error) {
				eval(data);
			}
		});
    };
	
	this.isTE = function(f) {
		if(f.teVisable) {
			$("article.isThreadAuthor .threadPostAuthorName .threadPostAuthorNameLink").before("<span style=\"color: #43a8da;\">TE</span>");
		}
	}
	
	this.ipTab = function(postid) {
		$( "body" ).delegate( "button.info" + postid, "click", function() {
			$('a.closer' + postid).parent().parent().remove();
			$('table.infoTab' + postid).prepend('<tr style="background-color: grey;line-height: 2;"><td style="text-align: center;"><a href="#" style="color: white" class="closer' + postid + '">' + chrome.i18n.getMessage(tld + "_close") + '</a></td></tr>')
			$("table.infoTab" + postid).toggle();
		});
	}
	
	this.ipTabOpen = function(postid) {
		$( "body" ).delegate( "table.infoTab" + postid + " a", "click", function() {
			var hrefIp = ($(this).attr("href")).split("=")[1];
			var param = { searchIpAddress: hrefIp, type: "ipAddress" }
			if(hrefIp === undefined) {
				$("table.infoTab" + postid).toggle();
			} else {
				$.ajax({
					url : userSearch,
					data: param,
					type: "GET",
					success: function(data, textStatus, jqXHR)
					{
					var win = window.open();
					win.document.write(data);
					},
					error: function (jqXHR, textStatus, errorThrown)
					{
				 
					}
				});
				console.log(hrefIp)
			}
			return false;
		});
	}
    
    this.chrome = function() {
    	myThis.chrome.storage.sync.get({
		teVisable: false,
		adminSiteVisable: false,
		mailToVisable: false,
		pnChangerVisable: false,
		warningVisable: false,
		ipVisable: false,
		viewWarningVisable: false
	}, function(items) {
		new Android().isTE(items)
		var header = $(".threadPostHeader").each(function(i,v) {
			var postid = $(this).parent().parent().parent().parent("article").data("postid");
			var userId = ($(v).find(".threadPostAuthorNameLink").attr("href").split("/")[2]);
			var userImageLink = ($(v).find(".threadPostAuthorImage img").attr("src").split("/")[2]);
			if(userId != "android") {
				if(userId == "413762") {
					$(this).find(".threadPostAuthorName .user-badges span").first().append("<span> DER KOPF</span>");
				}
				if(userId == "4361215" || userId == "2927890") {
					$(this).find(".threadPostAuthorName .user-badges span").first().append("<span> DEV</span>");
				}
				if(userId == "474375") {
					$(this).find(".threadPostAuthorName .user-badges span").first().append("<span> DIRTY UNICORNS</span>");
				}
				if(userId == "429327") {
					$(this).find(".threadPostAuthorName .user-badges span").first().append("<span> THE BOT</span>");
				}
				if(userId == "517270") {
					$(this).find(".threadPostAuthorName .user-badges span").first().append("<span> OPA</span>");
				}
				if(userId == "410056") {
					$(this).find(".threadPostAuthorName .user-badges span").first().append("<span> of Com</span>");
				}
				var thisC = this;
				$.get(adminSite + userId, function(my_var) {
					var tab = $(my_var).find("section table")[1];
					var tr = ($(tab).find("tbody tr")[0]);
					var tr1 = ($(tab).find("tbody tr")[3]);
					var tr2 = ($(tab).find("tbody tr")[4]);
					($(tr).children("td:first").remove());
					($(tr1).children("td:first").remove());
					($(tr2).children("td:first").remove());
					tr1text = $(tr1).find("td").html();
					tr1text1 = $(tr2).find("td").html();
					$(tr).find("td").append(tr1text + "<br>")
					$(tr).find("td").append(tr1text1 + "<br>")
					var trReg = ($(tab).find("tbody tr")[4]);
					trReg = $(trReg).text();
					var t = trReg.trim().split(" — ")[0];
					$(thisC).find(".threadPostAuthorAdminInfo").append("<li>" + (t) + "</li>");
					
					if($(thisC).find("div.threadPostWarningInfo a").attr("href") != undefined && items.viewWarningVisable) {
						$(thisC).after('<a class="btn-primary-small padding-y-small" style="background-color:#fe0000; margin-left: 1px;" href="' + listWarning + userId + '">' + chrome.i18n.getMessage(tld + "_warnings_user") + '</a>');
					}
					if(items.warningVisable) {
						$(thisC).after('<a class="btn-primary-small padding-y-small" style="background-color:#fe0000; margin-left: 1px;" href="' + warning + userId + '">' + chrome.i18n.getMessage(tld + "_warn_user") + '</a>');
					}
					if(items.ipVisable) {
						$(thisC).after('<table style="border: 1px solid black; border-radius: 5px; position: fixed; left: 50%; top: 15%; z-index: 9; background-color: beige; display: none;" class="infoTab' + postid + '">' + $(tr).html() + '</table>');
						$(thisC).after('<button class="btn-primary-small padding-y-small info' + postid + '" style="background-color:#fe0000; margin-left: 1px;" data-ip="'+postid+'">IP\'s</button>');
					}
					if(items.adminSiteVisable) {
						$(thisC).after('<a class="btn-primary-small padding-y-small" style="margin-left: 1px;" href="' + adminSite + userId + '">Adminsite</a>');
					}
					if(items.pnChangerVisable) {
						$(thisC).after('<a class="btn-primary-small padding-y-small" style="margin-left: 1px;" href="' + pnChange + userId + '">PM-Limit-Changer</a>');
					}
					if(items.mailToVisable) {
						$(thisC).after('<a class="btn-primary-small padding-y-small" style="margin-left: 1px;" href="' + mailTo + userId + '">' + chrome.i18n.getMessage(tld + "_send_mail") + '</a>');
					}
				});
			}
			new Android().ipTab(postid);
			new Android().ipTabOpen(postid);
		});
	});
	$( "body" ).delegate( "ul.threadPostOptionsButtons a", "click", function() {
		var mThis = this;
		if($(this).text().trim() == chrome.i18n.getMessage(tld + "_reply")) {
			$().ready(function() {
				setTimeout(writeSite, 1500);
			});
		} else if($(this).text().trim() == chrome.i18n.getMessage(tld + "_quote")) {
			$().ready(function() {
				setTimeout(function() {
					writeSite();
				}, 1500);
			});
		} 
	});
	$( "body" ).delegate( "a.schreib", "click", function() {
		var text = $(".forumEditorContent").val();
		text += decodeURIComponent($(this).data("text"));
		var modName = ($.trim($("div.forumEditor").parent().parent().find(".threadPostAuthorNameLink").text()));
		if(text.indexOf("%te%") >= 0) {
			var name = ($(this).parent().parent().parent().parent().parent().parent().parent().parent().find("a.threadPostAuthorNameLink").first().text()).trim()
			if(window.location.href.indexOf("/page/") >= 0) {
				var lage = window.location.href.length;
				var newPage = window.location.href.substr(0,lage-1)+1;
				var pages = window.location.href.split("/")
				newPage = pages[0]+pages[1]+"//"+pages[2]+"/"+pages[3]+"/"+pages[4]+"/"+pages[5]+"/page/1";
				$.get(newPage, function(content) {
					var first = $(content).find(".isThreadAuthor").first();
					var nameTE = ($(first).find("a.threadPostAuthorNameLink").text().trim());
					$(".forumEditorContent").val(text.replace('%te%' ,nameTE).replace('%Name%' ,name));
				});
			} else {
				var first = $(".isThreadAuthor").first();
				var nameTE = ($(first).find("a.threadPostAuthorNameLink").first().text().trim());
				$(".forumEditorContent").val(text.replace('%te%' ,nameTE).replace('%ModName%' ,modName).replace('%Name%' ,name));
			}
		} else if(text.indexOf("%Name%") >= 0) {
			var name = ($(this).parent().parent().parent().parent().parent().parent().parent().parent().find("a.threadPostAuthorNameLink").first().text()).trim()
			$(".forumEditorContent").val(text.replace('%Name%' ,name).replace('%ModName%' ,modName));
		} else {
			$(".forumEditorContent").val(text.replace('%ModName%' ,modName));
		}
		return false;
	});
	$( "body" ).delegate( "a.defaultButton", "click", function() {
		$(this).next().toggle();
		return false;
	});
	$(".pagerNewInactive").click(function() {
		window.location.href = window.location.origin + $(this).attr("href");
		return false;
	});			
    }
}

function writeSite() {
	$("div.forumEditor").prepend("<a href=\"#\" style=\"margin: 1px; padding: 2px !important;\" class=\"defaultButton btn-primary-small padding-y-small\">StandardTexte</a><div class=\"siteload\" style=\"display: none;\"><ul class=\"myMenu\"></ul><div style=\"clear:both;\"></div></div>");
	chrome.storage.local.get("text", function(items) {
		var allKeys = Object.keys(items);
	
		$.each(items["text"], function(index, value) {
			if(value != "" && index != "" ) {
				if($(".schreib").text() != index) {
					var myvar = '<li><a href="#" class="schreib btn-primary-small padding-y-small" style="margin: 1px; padding: 2px !important;" data-text="' + (value) + '">' + decodeURIComponent(index) + '</a></li>';
					$("ul.myMenu").append(myvar);
				}
			}
		});
	});
}
