//console.log(mail) // mail undefined -> Magazin || Forum 
console.log(hostPathLength)
console.log(area)
console.log(mail)
console.log(areaUserId)
console.log(admin)

if (mail == undefined && hostPathLength == 5 && area == "forum" && ((areaUserId == undefined) || (areaUserId = chrome.i18n.getMessage(tld + "_forum")))) {
	new Android().modPanel();
	console.log("überblick Forum")
}

if (mail == "userSearch") {
	// Button Layout fix UserSearch
	new Android().usersearchlayout();
	
}

if (mail == undefined && hostPathLength == 4 && area.length > 0) {
	console.log("Magazin");
	var wordfilter = new Array();
	$('.filter').remove();
	$('.articleComments .existingComments').removeHighlight();
	chrome.storage.local.get("wordFilter", function(result) {
		$.each(result['wordFilter'], function(i, v) {
			if(v) {
				var high = ($('.articleComments .existingComments').highlight( v ));
				$(".filter").show();
			}
		});
	});
	var i = 0;
	$(".commentContainer header a:not(.commentLink)").each(function(index, value) {
		var linkId = ($(value).attr("href").split("/")[2])
		var header = $(this).parent();
		myThis.chrome.storage.sync.get({
				adminSiteVisable: false,
				mailToVisable: false,
				warningVisable: false,
				viewWarningVisable: false,
				wordFilter: false,
				wordFilterColor: "#FFF34D",
				wordFilterColorText: "#FFFFFF",
				scrollToKommentar: false
			}, function(items) {
				if (items.scrollToKommentar) {
					setTimeout(function(){
						$('html, body').bind('scroll mousedown wheel DOMMouseScroll mousewheel keyup', function(e){
							if ( e.which > 0 || e.type == "mousedown" || e.type == "mousewheel") {
								$("html, body").stop();
							}
						});
						if(window.location.hash) {
							console.log(window.location.hash);
							$(window.location.hash).css({"border" : "1px solid red"})
							$('html, body').animate({
								scrollTop: $(window.location.hash).offset().top - 130
							}, 2000);
						} 
					}, 3500);
				}
				if (items.wordFilter) {
					$(document).ready(function() {
						$(".highlight").css({"background-color": items.wordFilterColor, "color": items.wordFilterColorText});
						if($("span").hasClass("highlight") && !$("div").hasClass("filter")) {
							$("body").prepend("<div class=\"filter\" style=\"position: fixed; z-index: 10000; padding: 10px; bottom: 0px; color: white; font-size: 0.7em; overflow: auto; width: 100px;background-color: rgba(255,0,0,0.9);max-height: 200px;\">" + chrome.i18n.getMessage(tld + "_word_filter") + "<li style=\"list-style: none;\"></li></div>")
						}
						if (i == 0) {
							$( ".commentContainer span.highlight" ).each(function( index ) {
								if(undefined != $(this).parent().attr("id")) {
									console.log($(this).parent().attr("id"))
									$(".filter li").append('<ul style="text-decoration: underline; cursor: pointer;" id="wcomment" data-id="' + $(this).parent().attr("id") + '">' + chrome.i18n.getMessage(tld + '_word_filter_match') + ' ' + (index+1) + "</ul>");
									$(".filter").show();
								}
							});
							i++;
						}
					});		
				}
				$.get(mailTo + linkId, function() {
					console.log("isExist User")
				})
				.done(function() {
					$.get(adminSite + linkId, function(my_var) {
						var tab = $(my_var).find("section table")[0];
						var tr = $(tab).find("tr")[2];
						if($(tr).find("td a").text() != "" && items.viewWarningVisable) {
							$(header).after('<a class="btn-primary-small padding-y-small" style="color:#fe0000 !important; background-color:#f0f0f0; margin-left: 1px;" href="' + listWarning + linkId + '">' + $(tr).find("td a").text() + '</a>')
						}
						if(items.warningVisable) {
							$(header).after('<a class="btn-primary-small padding-y-small" style="background-color:#fe0000; margin-left: 1px;" href="' + warning + linkId + '">' + chrome.i18n.getMessage(tld + "_warn_user") + '</a>')
						}
						if(items.adminSiteVisable) {
							$(header).after('<a class="btn-primary-small padding-y-small" style="margin-left: 1px;" href="' + adminSite + linkId + '">' + chrome.i18n.getMessage(tld + "_adminSite_text") + '</a>')
						}
						if(items.mailToVisable) {
							$(header).after('<a class="btn-primary-small padding-y-small" style="margin-left: 1px;" href="' + mailTo + linkId + '">' + chrome.i18n.getMessage(tld + "_send_mail") + '</a>');
						}
					});
				})
				.fail(function() {
					$(header).after('<a class="btn-primary-small padding-y-small" style="margin-left: 1px; background-color: red; cursor: default;">' + chrome.i18n.getMessage(tld + '_deleted_user') + '</a>')
				});
			}
		);
	});
	
	$( "body" ).delegate( "button.replyForm", "click", function() {
		if($(this).text().trim() == chrome.i18n.getMessage(tld + "_reply")) {
			var commentId = $(this).data("reply");
			$("li#comment" + commentId.commentId + " .replyFormDiv").append("<div class=\"siteload\"><ul class=\"myMenu\"></ul><div style=\"clear:both;\"></div></div>");
			myThis.chrome.storage.local.get("text", function(items) {
				var allKeys = Object.keys(items["text"]);
				$.each(items["text"], function(index, value) {
					if(value != "" && index != "" ) {
						if($(".schreib").text() != index) {
							var myvar = '<li style="padding: 2px;"><a href="#" style="padding: 2px; font-size:0.6em;" class="schreib btn-primary-small padding-y-small" data-text="' + value + '">' + decodeURIComponent(index) + '</a></li>';
							$("ul.myMenu").append(myvar);
						}
					}
				});
				$( "body" ).delegate(".schreib", "click", function() {
					var modName = "";
					var name = "";
					var nameTE = "";
					var text = $("#commentTextarea" + commentId.commentId).val();
					text += decodeURIComponent($(this).data("text"));
					text = text.replace('%ModName%' ,modName).replace('%Name%' ,name).replace('%te%' ,nameTE)
					setTimeout(writeText(text,commentId.commentId), 500);
					return false;
				});
			});
		}
	});
	$( "body" ).delegate( "button.addReplyComment, button.cancelReply", "click", function() {
		var text = $(this).data("text");
		$("div.siteload").remove();
		return true;
	});
	function writeText(text, position){
		var textarea = $(".newComment textarea#commentTextarea" + position);
		$(textarea).val(text);
		$(textarea).height(($(textarea).prop('scrollHeight')+25));
	}
} else if (mail == "mail-to" && hostPathLength == 8) {
	console.log("mail-to")
	var textZeile = $("#formRegister").find(".group")[2];
	$(textZeile).before("<div class=\"group bottommargin10\"><div class=\"col3\"><label><strong>" + chrome.i18n.getMessage("defaultText") + "</strong></label></div><div class=\"col9 last\"><div class=\"siteload\" style=\"display: inline-block;\"><ul class=\"myMenu\"></ul><div style=\"clear:both;\"></div></div></div>");

	myThis.chrome.storage.local.get("text", function(items) {
		$.each(items["text"], function(index, value) {
			if(value != "" && index != "" ) {
				if($(".schreib").text() != index) {
					var myvar = '<li><a href="#" class="schreib btn-primary-small padding-y-small" style="margin: 1px; padding: 2px !important;" data-text="' + value + '">' + decodeURIComponent(index) + '</a></li>';
					$("ul.myMenu").append(myvar);
				}
			}
		});
	});
	$( "body" ).delegate(".schreib", "click", function() {
		var text = $("textarea#text").val(); 
		text += decodeURIComponent($(this).data("text"));
		if(text.indexOf("%Name%") >= 0 || text.indexOf("%te%") >= 0 || text.indexOf("%ModName%") >= 0) {
			text = text.replace('%Name%' ,$("#receiverName").val()).replace('%te%' ,$("#receiverName").val()).replace('%ModName%' ,$("#senderName").val());
		}
		$("textarea#text").val(text);
		return false;
	});
} else if (((mail == "page") || (mail == undefined)) && hostPathLength >= 6 && area == "forum") {
	$(document).ready(function() {
		var base64_string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwCAMAAADxPgR5AAAASFBMVEWampr///+ZmZmVlZX4+Pi4uLjs7Ozj4+OSkpLGxsbq6uqioqK0tLT8/Pz39/eoqKjx8fG9vb3c3NzT09ONjY3Nzc3X19ekpKQiGSlbAAACBElEQVRoge2Yi3KrIBBAYQFBEcQ2rf//p13ARq23qXOBTGe6xzyISTisvGWMIAiCIAiCIIhfBzCALZ2frY13Cew/tNM9IaijEkBkDB4AT9DD2N8Zn+ATveQZx53sRX3DMQiwHXfBe3x473hn4fTr0qjx/7GuMgJs4G92iiz2jQcLe84F/A8fiNT71gxhCby/oRiPW8/DchAKUd6IYXofuj2Oe41veHII3B2/e59MaYhgB37E8QcMtrSnwIRNY+d4qOPcT8VVOPnHiq/C0n4CE1bUZXiYigcfiGPYZaDCQABg7WKvsNjU78s7/stwje4l9tfSnogZdFebTJd0pREKFn7oC5uwypQM30Z4KkdXZXq8C8OgdchJickhTVPOBay9UF/ouFTMslmmtLbMWp1CdDOsp2tHKBWAUfky6tgcdXI7ZZgYWwg9rieEkqsQ0Ws5RDOhSEK3Rsg+I8Q5sIlQpgi3S7pGSEISkpCEJCQhCf+KsM2aRqY1zb+E0ChCtV+13YWy2SWNqzazCdm2aoPW61J3vqS+mdCtQsaaNxo/GnFbc9aAu+ss9Aq35A0ixMp6VUq95lbazUrNuRzx9Px5uoYQvt8f7knG1hvSk7KrccsY9+z6ms7xQZTv8BFsmteIY1EFITCzu+n8iNHUuE0TcxA/Y+LLWsDyEAmCIAiCIAiCIH4bH4xGJkBZuFIHAAAAAElFTkSuQmCC";
		var image = $("<img>", {
			"src": base64_string,
			"class": "korb",
			"width": "35px",
				"height": "35px"});
		$(image).css({margin: "0 5px -10px 0"})
		$("#forumHeadingThread").prepend(image);	
		$("head").append('<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css"><script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>');
		$("body").append('<div id="dialog" class="diaclose" style="display:none;"><p>' + chrome.i18n.getMessage(tld + "_trash") + '</p></div>');
		$("body").append('<div id="dialogTry" class="diaclose" style="display:none;"><p>' + chrome.i18n.getMessage(tld + "_reason") + '</p><p><input type="text" class="korbText" value="Titel" placeholder="Titel" /></p></div>');
		$("body").append('<div id="dialogError" class="diaclose" style="display:none;"><p>mindestens 5 Zeichen!</p></div>');

		var sText = $('script').text();
		var u = sText.split("userId: ")[1];
		var UID = ($.trim(u.split(",")[0]))
		var yes = chrome.i18n.getMessage(tld + "_yes");
		var no = chrome.i18n.getMessage(tld + "_no");
		var okay = chrome.i18n.getMessage(tld + "_okay");
		var no_reply = chrome.i18n.getMessage(tld + "_no_reply");
		$(".korb").click(function() {
			$( "#dialog" ).dialog({
				buttons: [
					{
						text: yes,
						icons: {
							primary: "ui-icon-trash"
						},
						click: function() {
							console.log("TRASH")
							$.post(chrome.i18n.getMessage(tld + "_trash_url"),{ categoryId: chrome.i18n.getMessage(tld + "_trash_url_id"), threadId: areaUserId })
								.done(function( data ) {
									$("#dialogTry").dialog({
										buttons: [
											{
												text: okay,
												icons: {
													primary: "ui-icon-arrowreturnthick-1-e"
												},
												click: function() {
													var text = $(".korbText").val();
													$.post(chrome.i18n.getMessage(tld + "_send_reply"), {userId: UID, threadId: areaUserId, content: text})
														.done(function( data ) {
															$.post(chrome.i18n.getMessage(tld + "_close_url"), {threadId: areaUserId, closed: "1"})
																.done(function(da) {
																	var redirectURL = chrome.i18n.getMessage(tld + "_url") + data.redirectURL;
																	if(da.status == "ok") {
																		window.setTimeout(function() {
																			window.top.location.href = redirectURL;
																			location.reload();
																		}, 2000);
																	}
																});
														})
														.fail(function( data ) {
															alert(chrome.i18n.getMessage(tld + "_thread_close"));
														});
													console.log(text)
													console.log("REPLY")
													$( this ).dialog( "close" );
												}
											}, {
												text: no_reply,
												click: function() {
													$.post(chrome.i18n.getMessage(tld + "_close_url"), {threadId: areaUserId, closed: "1"})
														.done(function(da) {
															if (da.status == "ok") {
																window.setTimeout(function() {
																	location.reload();
																}, 2000);
															}
														});
													$( this ).dialog( "close" );
												}
											}
										]
									});
								})
								.fail(function( data ) {
									console.log("fail");
								})
							$( this ).dialog( "close" );
						}
					}, {
						text: no,
						icons: {
							primary: "ui-icon-close"
						},
						click: function() {
							$( this ).dialog( "close" );
						}
					}
				]
			});
		});
	});
	chrome.storage.sync.get({
		scrollToPost: false
	}, function(items) {
		if (items.scrollToPost) {
			setTimeout(function(){
				$('html, body').bind('scroll mousedown wheel DOMMouseScroll mousewheel keyup', function(e){
				    if ( e.which > 0 || e.type == "mousedown" || e.type == "mousewheel") {
				        $("html, body").stop();
				    }
				});
				if(window.location.hash) {
					$('html, body').animate({
						scrollTop: $(window.location.hash).offset().top - 30
						
					}, 2000);
				} else {
					var aid = $('article').attr('id');
					if(aid != undefined) {
						$('html, body').animate({
							scrollTop: $('#'+aid).offset().top - 30
						}, 2000);
					}
				}
			}, 1000);
		}
	});
	console.log("Thread")
}

if (mail == undefined && hostPathLength == 5 && area == "forum" && areaUserId == "post") {
	console.log("post Forum")
}

if (mail == undefined && hostPathLength == 4 && area.length == 0) {
	console.log("Startseite")
}
