$(function() {
	function fixed(elm) {
		if (elm.data("iscroll-plugin")) {
			return;
		}

		elm.css({
			overflow: 'hidden'
		});

         var barHeight = 0; // ҳͷҳβ�߶�
         var myScroll,
         pullUpEl, pullUpOffset;
         // ����ҳͷ��ʽ
         var $header = elm.find('[data-role="header"]');
         if ($header.length) {
         	$header.css({
         		"z-index": 1000,
         		padding: 0,
         		width: "100%"
         	});
         	barHeight += $header.height();
         }

         // ����ҳβ��ʽ
         var $footer = elm.find('[data-role="footer"]');
         if ($footer.length) {
         	$footer.css({
         		"z-index": 1500,
         		padding: 0,
         		width: "100%"
         	});
         	barHeight += $footer.height();
         }

         // ��������������ʽ���߶�
         var $wrapper = elm.find('[data-role="content"]');
         if ($wrapper.length) {
         	$wrapper.css({
         		"z-index": 1
         	});
         	$wrapper.height($(window).height() - barHeight);
         	$wrapper.bind('touchmove', function (e) { e.preventDefault(); });
         }
         // ���ˢ����ʾ
         var $li = $("[data-role='listview']");
         $li.after('<ul id="pullUp"><li class="pullUpIcon"></li><li class="pullUpLabel">��������ˢ��...</li></ul>');
         // ���ù�������
         var scroller = elm.find('[data-iscroll="scroller"]').get(0);
         if (!scroller) {
         	$($wrapper.get(0)).children().wrapAll("<div data-iscroll='scroller'></div>");
         }
         
         // ��ӹ�����
         pullUpEl = document.getElementById('pullUp');
         pullUpOffset = pullUpEl.offsetHeight;
         var iscroll = new iScroll($wrapper.get(0), {

         	hScroll        : false,
         	vScroll        : true,
         	hScrollbar     : false,
         	vScrollbar     : false,
         	fixedScrollbar : true,
         	fadeScrollbar  : false,
         	hideScrollbar  : true,
         	bounce         : true,
         	momentum       : true,
         	lockDirection  : true,
         	checkDOMChanges: true,
         	onBeforeScrollStart: function (e) {
         		var target = e.target;
         		while (target.nodeType != 1) target = target.parentNode;

                 // ������iscroll������������
                 if (target.tagName != 'SELECT'&& target.tagName !='option'&& target.tagName !='option' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                 	e.preventDefault();
                 e.stopPropagation();
             },
             onRefresh: function () {
             	if (pullUpEl.className.match('loading')) {
             		pullUpEl.className = '';
             		pullUpEl.querySelector('.pullUpLabel').innerHTML = '��������ˢ��...';
             	}
             },
             onScrollMove: function () {
             	this.minScrollY = 0;
             	if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
             		pullUpEl.className = 'flip';
             		pullUpEl.querySelector('.pullUpLabel').innerHTML = '�ɿ�����ˢ��...';
             		this.maxScrollY = this.maxScrollY;
             	} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
             		pullUpEl.className = '';
             		pullUpEl.querySelector('.pullUpLabel').innerHTML = '���ظ���...';
             		this.maxScrollY = pullUpOffset;
             	}
             },
             onScrollEnd: function () {
			// Execute custom function (ajax call?)
			if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '������...';				
				pullUpAction();	// Execute custom function (ajax call?)
			}
		}
	});
//��������
function pullUpAction () {
	setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
		loadData();
		myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

function loadData(){
	var el, li, i;
	el = $("#thelist");
	console.log($("#thelist li").length);
	li = $("#thelist li").first().html();
	console.log(li);
	for (i=0; i<10; i++) {
		// el.append(li);
		el.append("<li><a href='#'><img src='images/item4.jpg'/><h3> ����������</h3><p>�������������棩</p></a></li>")
	}
	// el.trigger( "create" );
	el.listview("refresh");
	console.log($("#thelist li").length);
}
elm.data("iscroll-plugin", iscroll);

window.setTimeout(function(){iscroll.refresh();}, 200);
}
$('[data-role="page"][data-iscroll="enable"]').bind("pageshow", function() {
	fixed($(this));
});
if ($.mobile.activePage.data("iscroll") == "enable") {
	fixed($.mobile.activePage);
}

});