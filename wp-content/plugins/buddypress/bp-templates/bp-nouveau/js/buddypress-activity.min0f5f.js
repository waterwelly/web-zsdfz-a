window.bp=window.bp||{},function(o,g){"undefined"!=typeof BP_Nouveau&&(o.Nouveau=o.Nouveau||{},o.Nouveau.Activity={start:function(){this.setupGlobals(),this.addListeners()},setupGlobals:function(){this.just_posted=[],this.current_page=1,this.mentions_count=Number(g(o.Nouveau.objectNavParent+' [data-bp-scope="mentions"]').find("a span").html())||0,this.heartbeat_data={newest:"",highlights:{},last_recorded:0,first_recorded:0,document_title:g(document).prop("title")}},addListeners:function(){g("#buddypress").on("bp_heartbeat_send",this.heartbeatSend.bind(this)),g("#buddypress").on("bp_heartbeat_tick",this.heartbeatTick.bind(this)),g('#buddypress [data-bp-list="activity"]').on("click","li.load-newest, li.load-more",this.injectActivities.bind(this)),g("#buddypress [data-bp-list]").on("bp_ajax_request",this.updateRssLink),g("#buddypress").on("bp_ajax_request",'[data-bp-list="activity"]',this.scopeLoaded.bind(this)),g('#buddypress [data-bp-list="activity"]').on("bp_ajax_append",this.hideComments),g('#buddypress [data-bp-list="activity"]').on("click",".show-all",this.showComments),g('#buddypress [data-bp-list="activity"]').on("click",".activity-item",o.Nouveau,this.activityActions),g(document).on("keydown",this.commentFormAction)},heartbeatSend:function(t,a){this.heartbeat_data.first_recorded=g("#buddypress [data-bp-list] [data-bp-activity-id]").first().data("bp-timestamp")||0,(0===this.heartbeat_data.last_recorded||this.heartbeat_data.first_recorded>this.heartbeat_data.last_recorded)&&(this.heartbeat_data.last_recorded=this.heartbeat_data.first_recorded),a.bp_activity_last_recorded=this.heartbeat_data.last_recorded,g("#buddypress .dir-search input[type=search]").length&&(a.bp_activity_last_recorded_search_terms=g("#buddypress .dir-search input[type=search]").val()),g.extend(a,{bp_heartbeat:o.Nouveau.getStorage("bp-activity")})},heartbeatTick:function(t,a){var e,i,s=o.Nouveau.objects,n=o.Nouveau.getStorage("bp-activity","scope"),d=this;void 0!==a&&a.bp_activity_newest_activities&&(this.heartbeat_data.newest=g.trim(a.bp_activity_newest_activities.activities)+this.heartbeat_data.newest,this.heartbeat_data.last_recorded=Number(a.bp_activity_newest_activities.last_recorded),i=g(this.heartbeat_data.newest).filter(".activity-item"),e=Number(i.length),s.push("mentions"),"all"===n?(g.each(i,function(t,e){e=g(e),g.each(s,function(t,a){-1!==g.inArray("bp-my-"+a,e.get(0).classList)&&(void 0===d.heartbeat_data.highlights[a]?d.heartbeat_data.highlights[a]=[e.data("bp-activity-id")]:-1===g.inArray(e.data("bp-activity-id"),d.heartbeat_data.highlights[a])&&d.heartbeat_data.highlights[a].push(e.data("bp-activity-id")))})}),a=new RegExp("bp-my-("+s.join("|")+")","g"),this.heartbeat_data.newest=this.heartbeat_data.newest.replace(a,""),g(o.Nouveau.objectNavParent+' [data-bp-scope="all"]').find("a span").html(e)):(this.heartbeat_data.highlights[n]=[],g.each(i,function(t,a){d.heartbeat_data.highlights[n].push(g(a).data("bp-activity-id"))})),g.each(s,function(t,a){var e;void 0!==d.heartbeat_data.highlights[a]&&d.heartbeat_data.highlights[a].length&&(e=0,"mentions"===a&&(e=d.mentions_count),g(o.Nouveau.objectNavParent+' [data-bp-scope="'+a+'"]').find("a span").html(Number(d.heartbeat_data.highlights[a].length)+e))}),s.pop(),g(document).prop("title","("+e+") "+this.heartbeat_data.document_title),g('#buddypress [data-bp-list="activity"] li').first().hasClass("load-newest")?(i=g('#buddypress [data-bp-list="activity"] .load-newest a').html(),g('#buddypress [data-bp-list="activity"] .load-newest a').html(i.replace(/([0-9]+)/,e))):g('#buddypress [data-bp-list="activity"] ul.activity-list').prepend('<li class="load-newest"><a href="#newest">'+BP_Nouveau.newest+" ("+e+")</a></li>"),g('#buddypress [data-bp-list="activity"]').trigger("bp_heartbeat_pending",this.heartbeat_data))},injectActivities:function(a){var e,i,t,s=o.Nouveau.getStorage("bp-activity"),n=s.scope||null,s=s.filter||null;g(a.currentTarget).hasClass("load-newest")?(a.preventDefault(),g(a.currentTarget).remove(),t=g.parseHTML(this.heartbeat_data.newest),g.each(t,function(t,a){"LI"===a.nodeName&&g(a).hasClass("just-posted")&&g("#"+g(a).prop("id")).length&&g("#"+g(a).prop("id")).remove()}),g(a.delegateTarget).find(".activity-list").prepend(this.heartbeat_data.newest).trigger("bp_heartbeat_prepend",this.heartbeat_data),this.heartbeat_data.newest="","all"===n&&g(o.Nouveau.objectNavParent+' [data-bp-scope="all"]').find("a span").html(""),"mentions"===n&&(o.Nouveau.ajax({action:"activity_clear_new_mentions"},"activity"),this.mentions_count=0),g(o.Nouveau.objectNavParent+' [data-bp-scope="'+n+'"]').find("a span").html(""),void 0!==this.heartbeat_data.highlights[n]&&(this.heartbeat_data.highlights[n]=[]),setTimeout(function(){g(a.delegateTarget).find("[data-bp-activity-id]").removeClass("newest_"+n+"_activity")},3e3),g(document).prop("title",this.heartbeat_data.document_title)):g(a.currentTarget).hasClass("load-more")&&(e=+Number(this.current_page)+1,i=this,t="",a.preventDefault(),g(a.currentTarget).find("a").first().addClass("loading"),this.just_posted=[],g(a.delegateTarget).children(".just-posted").each(function(){i.just_posted.push(g(this).data("bp-activity-id"))}),g("#buddypress .dir-search input[type=search]").length&&(t=g("#buddypress .dir-search input[type=search]").val()),o.Nouveau.objectRequest({object:"activity",scope:n,filter:s,search_terms:t,page:e,method:"append",exclude_just_posted:this.just_posted.join(","),target:"#buddypress [data-bp-list] ul.bp-list"}).done(function(t){!0===t.success&&(g(a.currentTarget).remove(),i.current_page=e)}))},hideComments:function(t){var e,i,s,n,t=g(t.target).find(".activity-comments");t.length&&t.each(function(t,a){n=g(a).children("ul"),(i=g(n).find("li")).length&&(e=g(a).closest(".activity-item"),s=g("#acomment-comment-"+e.data("bp-activity-id")+" span.comment-count").html()||" ",i.each(function(t,a){t<i.length-5&&(g(a).addClass("bp-hidden").hide(),t||void 0!==(t=e.data("bpActivityId"))&&(t=parseInt(t,10),g(a).before('<li class="show-all"><button class="text-button" type="button" data-bp-show-comments-id="#activity-'+t+'/show-all/"><span class="icon dashicons dashicons-visibility" aria-hidden="true"></span> '+BP_Nouveau.show_x_comments.replace("%d",s)+"</button></li>")))}),g(n).children(".bp-hidden").length===g(n).children("li").length-1&&g(n).find("li.show-all").length&&g(n).children("li").removeClass("bp-hidden").toggle())})},showComments:function(t){t.preventDefault(),g(t.target).addClass("loading"),setTimeout(function(){g(t.target).closest("ul").find("li").removeClass("bp-hidden").fadeIn(300,function(){g(t.target).parent("li").remove()})},600)},scopeLoaded:function(t,e){this.hideComments(t),this.current_page=1,"mentions"===e.scope&&void 0!==e.response.new_mentions?(g.each(e.response.new_mentions,function(t,a){g("#buddypress #activity-stream").find('[data-bp-activity-id="'+a+'"]').addClass("newest_mentions_activity")}),this.mentions_count=0):void 0!==this.heartbeat_data.highlights[e.scope]&&this.heartbeat_data.highlights[e.scope].length&&g.each(this.heartbeat_data.highlights[e.scope],function(t,a){g("#buddypress #activity-stream").find('[data-bp-activity-id="'+a+'"]').length&&g("#buddypress #activity-stream").find('[data-bp-activity-id="'+a+'"]').addClass("newest_"+e.scope+"_activity")}),this.heartbeat_data.newest="",g.each(g(o.Nouveau.objectNavParent+" [data-bp-scope]").find("a span"),function(t,a){0===parseInt(g(a).html(),10)&&g(a).html("")}),void 0!==this.heartbeat_data.highlights[e.scope]&&(this.heartbeat_data.highlights[e.scope]=[]),g(document).prop("title",this.heartbeat_data.document_title),setTimeout(function(){g("#buddypress #activity-stream .activity-item").removeClass("newest_"+e.scope+"_activity")},3e3)},activityActions:function(t){var e,i,s=t.data,n=g(t.target),d=g(t.currentTarget),a=d.data("bp-activity-id"),o=g(t.delegateTarget);if(((n=g(n).is("span")?g(n).closest("a"):n).hasClass("fav")||n.hasClass("unfav"))&&(e=n.hasClass("fav")?"fav":"unfav",t.preventDefault(),n.addClass("loading"),s.ajax({action:"activity_mark_"+e,id:a},"activity").done(function(t){var a;n.removeClass("loading"),!1!==t.success&&(n.fadeOut(200,function(){(g(this).find("span").first().length?g(this).find("span").first():g(this)).html(t.data.content),g(this).attr("data-bp-tooltip",t.data.content),"false"===g(this).attr("aria-pressed")?g(this).attr("aria-pressed","true"):g(this).attr("aria-pressed","false"),g(this).fadeIn(200)}),"fav"==e?(void 0!==t.data.directory_tab&&(g(s.objectNavParent+' [data-bp-scope="favorites"]').length||g(s.objectNavParent+' [data-bp-scope="all"]').after(t.data.directory_tab)),n.removeClass("fav"),n.addClass("unfav")):"unfav"==e&&((a=g('[data-bp-user-scope="favorites"]').hasClass("selected")||g(s.objectNavParent+' [data-bp-scope="favorites"]').hasClass("selected"))&&d.remove(),void 0!==t.data.no_favorite&&(g(s.objectNavParent+' [data-bp-scope="all"]').length&&g(s.objectNavParent+' [data-bp-scope="all"]').hasClass("selected")?g(s.objectNavParent+' [data-bp-scope="favorites"]').remove():a&&o.append(t.data.no_favorite)),n.removeClass("unfav"),n.addClass("fav")))})),n.hasClass("delete-activity")||n.hasClass("acomment-delete")||n.hasClass("spam-activity")||n.hasClass("spam-activity-comment")){var r,c,l,h,p=n.closest("[data-bp-activity-comment-id]"),u=p.data("bp-activity-comment-id"),m=0;if(t.preventDefault(),void 0!==BP_Nouveau.confirm&&!1===window.confirm(BP_Nouveau.confirm))return!1;n.addClass("loading");var v={action:"delete_activity",id:a,_wpnonce:s.getLinkParams(n.prop("href"),"_wpnonce"),is_single:n.closest("[data-bp-single]").length};(n.hasClass("spam-activity")||n.hasClass("spam-activity-comment"))&&(v.action="bp_spam_activity"),r=d,u&&(delete v.is_single,v.id=u,v.is_comment=!0,r=p),p.find("form").length&&d.find(".activity-comments").append(p.find("form")),s.ajax(v,"activity").done(function(t){if(n.removeClass("loading"),!1===t.success)r.prepend(t.data.feedback),r.find(".bp-feedback").hide().fadeIn(300);else{if(t.data.redirect)return window.location.href=t.data.redirect;u&&(m=1,t.data.deleted?(m=t.data.deleted.length,t.data.deleted.forEach(function(t){g('[data-bp-activity-comment-id="'+t+'"]').remove()})):g.each(p.find("li"),function(){m+=1}),c=d.find(".acomment-reply span.comment-count"),l=Number(c.html()-m),c.html(l),(h=d.find("li.show-all a")).length&&h.html(BP_Nouveau.show_x_comments.replace("%d",l)),0===l&&d.removeClass("has-comments")),r.slideUp(300,function(){r.remove()}),u||d.data("bp-timestamp")!==s.Activity.heartbeat_data.last_recorded||(s.Activity.heartbeat_data.newest="",s.Activity.heartbeat_data.last_recorded=0)}})}if(n.closest("span").hasClass("activity-read-more")){var b=n.closest("div"),_=n.closest("span"),f=null;if(g(b).hasClass("activity-inner")?f=a:g(b).hasClass("acomment-content")&&(f=n.closest("li").data("bp-activity-comment-id")),!f)return t;t.preventDefault(),g(_).addClass("loading"),s.ajax({action:"get_single_activity_content",id:f},"activity").done(function(t){g(_).removeClass("loading"),b.parent().find(".bp-feedback").length&&b.parent().find(".bp-feedback").remove(),!1===t.success?(b.after(t.data.feedback),b.parent().find(".bp-feedback").hide().fadeIn(300)):g(b).slideUp(300).html(t.data.contents).slideDown(300)})}if(n.hasClass("acomment-reply")||n.parent().hasClass("acomment-reply")){var y=g("#ac-form-"+a);if(f=a,t.preventDefault(),!y.length){v=n.closest("li.activity").find(".activity-meta a.view").prop("href");return v&&(window.location.href=v),!1}n.parent().hasClass("acomment-reply")&&n.parent(),n.closest("li").data("bp-activity-comment-id")&&(f=n.closest("li").data("bp-activity-comment-id")),y.removeClass("root"),g(".ac-form").hide(),g.each(y.children("div"),function(t,a){g(a).hasClass("error")&&g(a).remove()}),f===a?(g('[data-bp-activity-id="'+f+'"] .activity-comments').append(y),y.addClass("root")):g('[data-bp-activity-comment-id="'+f+'"]').append(y),y.slideDown(200),n.attr("aria-expanded","true"),g.scrollTo(y,500,{offset:-100,easing:"swing"}),g("#ac-form-"+a+" textarea").trigger("focus")}n.hasClass("ac-reply-cancel")&&(g(n).closest(".ac-form").slideUp(200),g(".acomment-reply").attr("aria-expanded","false"),t.preventDefault()),"ac_form_submit"===n.prop("name")&&(y=n.closest("form"),f=a,t.preventDefault(),n.closest("li").data("bp-activity-comment-id")&&(f=n.closest("li").data("bp-activity-comment-id")),i=g(y).find("textarea").first(),n.addClass("loading").prop("disabled",!0),i.addClass("loading").prop("disabled",!0),f={action:"new_activity_comment",_wpnonce_new_activity_comment:g("#_wpnonce_new_activity_comment_"+a).val(),comment_id:f,form_id:a,content:i.val()},g("#_bp_as_nonce_"+a).val()&&(f["_bp_as_nonce_"+a]=g("#_bp_as_nonce_"+a).val()),s.ajax(f,"activity").done(function(t){var a,e;n.removeClass("loading"),i.removeClass("loading"),g(".acomment-reply").attr("aria-expanded","false"),!1===t.success?y.append(g(t.data.feedback).hide().fadeIn(200)):(a=y.parent(),e=g.trim(t.data.contents),y.fadeOut(200,function(){0===a.children("ul").length&&(a.hasClass("activity-comments")?a.prepend("<ul></ul>"):a.append("<ul></ul>")),a.children("ul").append(g(e).hide().fadeIn(200)),g(y).find("textarea").first().val(""),a.parent().addClass("has-comments")}),l=Number(g(d).find("a span.comment-count").html()||0)+1,g(d).find("a span.comment-count").html(l),(h=g(d).find(".show-all a"))&&h.html(BP_Nouveau.show_x_comments.replace("%d",l))),n.prop("disabled",!1),i.prop("disabled",!1)}))},commentFormAction:function(t){var a,e;return(t=t||window.event).target?a=t.target:t.srcElement&&(a=t.srcElement),3===a.nodeType&&(a=a.parentNode),!0!==t.altKey&&!0!==t.metaKey&&"TEXTAREA"===a.tagName&&g(a).hasClass("ac-input")?void(27===(e=t.keyCode||t.which)&&!1===t.ctrlKey?"TEXTAREA"===a.tagName&&g(a).closest("form").slideUp(200):t.ctrlKey&&13===e&&g(a).val()&&g(a).closest("form").find("[type=submit]").first().trigger("click")):t},updateRssLink:function(t,a){a=a.response.feed_url||"";a&&g("body:not(.bp-user) #activity-rss-feed").length&&g("#activity-rss-feed").find("a").first().prop("href",a)}},o.Nouveau.Activity.start())}(window.bp,jQuery);