/**
 * Created by 薄雪婷 on 2016/3/10.
 */
var fs = require('fs');
var path = require('path');

var root = process.cwd();                               //当前的绝对路径
var src_path = path.join(root, "protocals");            //csv文件路径
var build_path = path.join(root, "protocalsTemp");      //生成jmx路径

var ip = '10.0.1.70';                                   //ip
var port = '8080';                                      //port

var middle = "	&quot;{0}&quot;:&quot;{1}&quot;,&#xd;\n\
";

var template = '<?xml version="1.0" encoding="UTF-8"?>\n\
<jmeterTestPlan version="1.2" properties="2.8" jmeter="2.13 r1665067">\n\
  <hashTree>\n\
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="测试计划" enabled="true">\n\
      <stringProp name="TestPlan.comments"></stringProp>\n\
      <boolProp name="TestPlan.functional_mode">false</boolProp>\n\
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>\n\
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="用户定义的变量" enabled="true">\n\
        <collectionProp name="Arguments.arguments"/>\n\
      </elementProp>\n\
      <stringProp name="TestPlan.user_define_classpath"></stringProp>\n\
    </TestPlan>\n\
    <hashTree>\n\
      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="{0}" enabled="true">\n\
        <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>\n\
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="循环控制器" enabled="true">\n\
          <boolProp name="LoopController.continue_forever">false</boolProp>\n\
          <intProp name="LoopController.loops">-1</intProp>\n\
        </elementProp>\n\
        <stringProp name="ThreadGroup.num_threads">500</stringProp>\n\
        <stringProp name="ThreadGroup.ramp_time">0</stringProp>\n\
        <longProp name="ThreadGroup.start_time">1442927409000</longProp>\n\
        <longProp name="ThreadGroup.end_time">1442927409000</longProp>\n\
        <boolProp name="ThreadGroup.scheduler">false</boolProp>\n\
        <stringProp name="ThreadGroup.duration"></stringProp>\n\
        <stringProp name="ThreadGroup.delay"></stringProp>\n\
      </ThreadGroup>\n\
      <hashTree>\n\
        <ResultCollector guiclass="StatVisualizer" testclass="ResultCollector" testname="聚合报告 {1}" enabled="true">\n\
          <boolProp name="ResultCollector.error_logging">false</boolProp>\n\
          <objProp>\n\
            <name>saveConfig</name>\n\
            <value class="SampleSaveConfiguration">\n\
              <time>true</time>\n\
              <latency>true</latency>\n\
              <timestamp>true</timestamp>\n\
              <success>true</success>\n\
              <label>true</label>\n\
              <code>true</code>\n\
              <message>true</message>\n\
              <threadName>true</threadName>\n\
              <dataType>true</dataType>\n\
              <encoding>false</encoding>\n\
              <assertions>true</assertions>\n\
              <subresults>true</subresults>\n\
              <responseData>false</responseData>\n\
              <samplerData>false</samplerData>\n\
              <xml>false</xml>\n\
              <fieldNames>false</fieldNames>\n\
              <responseHeaders>false</responseHeaders>\n\
              <requestHeaders>false</requestHeaders>\n\
              <responseDataOnError>false</responseDataOnError>\n\
              <saveAssertionResultsFailureMessage>false</saveAssertionResultsFailureMessage>\n\
              <assertionsResultsToSave>0</assertionsResultsToSave>\n\
              <bytes>true</bytes>\n\
              <threadCounts>true</threadCounts>\n\
            </value>\n\
          </objProp>\n\
          <stringProp name="filename"></stringProp>\n\
        </ResultCollector>\n\
        <hashTree/>\n\
        <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="HTTP请求 {2}" enabled="true">\n\
          <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>\n\
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments">\n\
            <collectionProp name="Arguments.arguments">\n\
              <elementProp name="" elementType="HTTPArgument">\n\
                <boolProp name="HTTPArgument.always_encode">false</boolProp>\n\
                <stringProp name="Argument.value">{&#xd;\n\
{3}\n\
}&#xd;\n\
</stringProp>\n\
                <stringProp name="Argument.metadata">=</stringProp>\n\
              </elementProp>\n\
            </collectionProp>\n\
          </elementProp>\n\
          <stringProp name="HTTPSampler.domain">{4}</stringProp>\n\
          <stringProp name="HTTPSampler.port">{5}</stringProp>\n\
          <stringProp name="HTTPSampler.connect_timeout"></stringProp>\n\
          <stringProp name="HTTPSampler.response_timeout"></stringProp>\n\
          <stringProp name="HTTPSampler.protocol"></stringProp>\n\
          <stringProp name="HTTPSampler.contentEncoding">utf-8</stringProp>\n\
          <stringProp name="HTTPSampler.path">/CS_{6}</stringProp>\n\
          <stringProp name="HTTPSampler.method">POST</stringProp>\n\
          <boolProp name="HTTPSampler.follow_redirects">true</boolProp>\n\
          <boolProp name="HTTPSampler.auto_redirects">false</boolProp>\n\
          <boolProp name="HTTPSampler.use_keepalive">true</boolProp>\n\
          <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>\n\
          <stringProp name="HTTPSampler.implementation">HttpClient4</stringProp>\n\
          <boolProp name="HTTPSampler.monitor">false</boolProp>\n\
          <stringProp name="HTTPSampler.embedded_url_re"></stringProp>\n\
        </HTTPSamplerProxy>\n\
        <hashTree/>\n\
      </hashTree>\n\
    </hashTree>\n\
  </hashTree>\n\
</jmeterTestPlan>\n\
';


/**
 * 格式化字符串
 */
String.prototype.format = function (args) {
    var ret = this;
    if(arguments.length > 0) {
        for(var i = 0; i < arguments.length; ++i) {
            var reg = new RegExp('({)' + i + '(})', 'g');
            ret = ret.replace(reg, arguments[i]);
        }
    }
    return ret;
};

/**
 * 判断build_path文件夹是否存在，若不存在，则创建
 */
function createFolder(callback) {
    fs.exists(build_path, function (exists) {
        if (!exists) {
            fs.mkdir(build_path, function (err) {
                if (err) {
                    console.log("创建protocalsTemp文件夹失败");
                    return;
                }
                callback(true);
            });
        }else{
            if((!(fs.statSync(build_path).isDirectory()))){
                console.log("要写入的目标文件夹不存在!!!");
                return;
            }
        }
    });
    if(!(fs.statSync(src_path).isDirectory())){
        return;
    }
    callback(true);
}

/**
 * 读取文件，将文件内容放入数组m中,参数pathname即为文件的路径
 */
function readFile(pathname, callback) {
    var m = [];
    var input = fs.readFileSync(pathname, 'utf-8');
    m = input.split("\n");
    callback(m);
}

/**
 * 创建js文件，并写入数据
 */
function createJSFile(pathname) {
    fs.readdirSync(pathname).forEach(function (fileName) {
        var fullPath = path.join(pathname, fileName);/* 拼接完整路径 */
        readFile(fullPath, function (fileContent) {
            for (var i = 0; i < fileContent.length; i = i + 4) {
                var row1 = [];                                  //每一组第一行的信息（标题）
                var row2 = [];                                  //每一组第二行的信息（req）
                row1 = fileContent[i].split(",");
                row2 = fileContent[i + 1].split(",");

                if (row1[0] == "") {
                    break;
                }
                var proto_name = row1[1];                       //协议名
                var proto_content = '';                         //拼接消息中的字段

                for(var j = 1; j < row2.length; j += 3) {
                    var field = row2[j].replace("'");
                    var info = row2[j+1].replace("'");

                    if (field === "") {
                        break;
                    }

                    proto_content += middle.format(field, info);
                }
                var proto_content1 = proto_content.substring(0, proto_content.length - 7) + proto_content.substring(proto_content.length - 6);
                proto_content = proto_content1.substring(0, proto_content1.length - 1);
                fs.writeFile(path.join(build_path, proto_name + ".jmx"), (template.format(proto_name, proto_name , proto_name, proto_content, ip, port, proto_name)), { encoding:'utf-8' }, function (err) {
                    if(err){
                        console.error(err);
                    }else{
                        console.log("写入  "+proto_name+".jmx 成功");
                    }
                });
            }
        });
    });
}

function startWrite(pn){
    createFolder(function (result) {
        if(result){
            createJSFile(pn);
        }
    })
}

startWrite(src_path);