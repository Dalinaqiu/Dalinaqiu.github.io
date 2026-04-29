import{_ as s,c as n,b as i,o as a}from"./app-hbLPDTA1.js";const t={};function l(d,e){return a(),n("div",null,[...e[0]||(e[0]=[i(`<h2 id="ubuntu安装git和docker" tabindex="-1"><a class="header-anchor" href="#ubuntu安装git和docker"><span>ubuntu安装git和docker</span></a></h2><p>1、向 source.list 中添加 Docker 软件源</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -</span>
<span class="line"></span>
<span class="line">sudo add-apt-repository &quot;deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu $(lsb_release -cs) stable&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、安装</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">sudo apt-get update</span>
<span class="line">sudo apt-get install docker-ce</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>3、启动 Docker CE</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">sudo systemctl enable docker</span>
<span class="line">sudo systemctl start docker</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>4、测试</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">sudo docker run hello-world</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>5、安装git</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">sudo apt-get install git</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>6、卸载Docker CE</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">sudo apt-get remove docker docker-engine docker.io</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="处理-https-registry-1-docker-io-v2-timeout-问题" tabindex="-1"><a class="header-anchor" href="#处理-https-registry-1-docker-io-v2-timeout-问题"><span>处理‘https://registry-1.docker.io/v2/‘Timeout 问题</span></a></h2><p>1、修改docker配置文件</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">$ vim /etc/docker/daemon.json</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>2、添加以下内容</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">{</span>
<span class="line">    &quot;runtimes&quot;: {</span>
<span class="line">        &quot;nvidia&quot;: {</span>
<span class="line">            &quot;args&quot;: [],</span>
<span class="line">            &quot;path&quot;: &quot;nvidia-container-runtime&quot;</span>
<span class="line">        }</span>
<span class="line">    },</span>
<span class="line">    &quot;registry-mirrors&quot;: [</span>
<span class="line">        &quot;https://docker.registry.cyou&quot;,</span>
<span class="line">        &quot;https://docker-cf.registry.cyou&quot;,</span>
<span class="line">        &quot;https://dockercf.jsdelivr.fyi&quot;,</span>
<span class="line">        &quot;https://docker.jsdelivr.fyi&quot;,</span>
<span class="line">        &quot;https://dockertest.jsdelivr.fyi&quot;,</span>
<span class="line">        &quot;https://mirror.aliyuncs.com&quot;,</span>
<span class="line">        &quot;https://dockerproxy.com&quot;,</span>
<span class="line">        &quot;https://mirror.baidubce.com&quot;,</span>
<span class="line">        &quot;https://docker.m.daocloud.io&quot;,</span>
<span class="line">        &quot;https://docker.nju.edu.cn&quot;,</span>
<span class="line">        &quot;https://docker.mirrors.sjtug.sjtu.edu.cn&quot;,</span>
<span class="line">        &quot;https://docker.mirrors.ustc.edu.cn&quot;,</span>
<span class="line">        &quot;https://mirror.iscas.ac.cn&quot;,</span>
<span class="line">        &quot;https://docker.rainbond.cc&quot;</span>
<span class="line">    ]</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、重启docker</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">$ systemctl daemon-reload</span>
<span class="line">$ systemctl restart docker</span>
<span class="line">$ DOCKER_CLIENT_TIMEOUT=300 COMPOSE_HTTP_TIMEOUT=300 docker-compose up -d</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,20)])])}const c=s(t,[["render",l]]),u=JSON.parse('{"path":"/blogs/other/20250329.html","title":"安装BISHENG","lang":"en-US","frontmatter":{"title":"安装BISHENG","date":"2025/03/29","tags":["日志"],"categories":["日志"]},"headers":[{"level":2,"title":"ubuntu安装git和docker","slug":"ubuntu安装git和docker","link":"#ubuntu安装git和docker","children":[]},{"level":2,"title":"处理‘https://registry-1.docker.io/v2/‘Timeout 问题","slug":"处理-https-registry-1-docker-io-v2-timeout-问题","link":"#处理-https-registry-1-docker-io-v2-timeout-问题","children":[]}],"git":{"createdTime":1747709983000,"updatedTime":1747709983000,"contributors":[{"name":"liqiu","email":"qiuli@sohu-inc.com","commits":1}]},"filePathRelative":"blogs/other/20250329.md"}');export{c as comp,u as data};
