import{_ as s,o as n,c as a,e}from"./app-55909009.js";const i="/assets/img_v3_02bc_e32cf69a-641e-4d38-9888-96e69b416b7g-728830b6.jpg",l={},c=e(`<h1 id="解决centos-7不能安装高版本nodejs问题" tabindex="-1"><a class="header-anchor" href="#解决centos-7不能安装高版本nodejs问题" aria-hidden="true">#</a> 解决centos 7不能安装高版本Nodejs问题</h1><h2 id="背景" tabindex="-1"><a class="header-anchor" href="#背景" aria-hidden="true">#</a> 背景</h2><p>contos7上安装18以上的nodejs会报错，错误原因为glibc库版本过低，需要升级：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>node: /lib64/libm.so.6: version <span class="token variable"><span class="token variable">\`</span>GLIBC_2.27’ not found <span class="token punctuation">(</span>required by <span class="token function">node</span><span class="token punctuation">)</span>

node: /lib64/libc.so.6: version <span class="token variable">\`</span></span>GLIBC_2.25’ not found <span class="token punctuation">(</span>required by <span class="token function">node</span><span class="token punctuation">)</span>

node: /lib64/libc.so.6: version <span class="token variable"><span class="token variable">\`</span>GLIBC_2.28’ not found <span class="token punctuation">(</span>required by <span class="token function">node</span><span class="token punctuation">)</span>

node: /lib64/libstdc++.so.6: version <span class="token variable">\`</span></span>CXXABI_1.3.9’ not found <span class="token punctuation">(</span>required by <span class="token function">node</span><span class="token punctuation">)</span>

node: /lib64/libstdc++.so.6: version <span class="token variable"><span class="token variable">\`</span>GLIBCXX_3.4.20’ not found <span class="token punctuation">(</span>required by <span class="token function">node</span><span class="token punctuation">)</span>

node: /lib64/libstdc++.so.6: version <span class="token variable">\`</span></span>GLIBCXX_3.4.21’ not found <span class="token punctuation">(</span>required by <span class="token function">node</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="解决方案" tabindex="-1"><a class="header-anchor" href="#解决方案" aria-hidden="true">#</a> 解决方案</h2><ol><li>检查系统glibc版本</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>strings /lib64/libc.so.6 <span class="token operator">|</span><span class="token function">grep</span> GLIBC_
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2"><li>根据提示下载对应的glibc版本</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">wget</span> http://ftp.gnu.org/gnu/glibc/glibc-2.28.tar.gz

<span class="token function">tar</span> <span class="token parameter variable">-xf</span> glibc-2.28.tar.gz

<span class="token builtin class-name">cd</span> glibc-2.28/ <span class="token operator">&amp;&amp;</span> <span class="token function">mkdir</span> build <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> build

<span class="token punctuation">..</span>/configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/usr --disable-profile --enable-add-ons --with-headers<span class="token operator">=</span>/usr/include --with-binutils<span class="token operator">=</span>/usr/bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可能会报错：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># make问题</span>
configure: error:
*** These critical programs are missing or too old: <span class="token function">make</span> bison compiler
*** Check the INSTALL <span class="token function">file</span> <span class="token keyword">for</span> required versions.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>解决办法：升级gcc与make</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 升级GCC</span>
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> centos-release-scl
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> devtoolset-8-gcc*

<span class="token function">mv</span> /usr/bin/gcc /usr/bin/gcc-4.8.5

<span class="token function">ln</span> <span class="token parameter variable">-s</span> /opt/rh/devtoolset-8/root/bin/gcc /usr/bin/gcc

<span class="token function">mv</span> /usr/bin/g++ /usr/bin/g+±4.8.5

<span class="token function">ln</span> <span class="token parameter variable">-s</span> /opt/rh/devtoolset-8/root/bin/g++ /usr/bin/g++
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 升级make</span>
<span class="token function">wget</span> http://ftp.gnu.org/gnu/make/make-4.3.tar.gz

<span class="token function">tar</span> <span class="token parameter variable">-xzvf</span> make-4.3.tar.gz <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> make-4.3/

./configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/usr/local/make

<span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span>

<span class="token builtin class-name">cd</span> /usr/bin/ <span class="token operator">&amp;&amp;</span> <span class="token function">mv</span> <span class="token function">make</span> make.bak

<span class="token function">ln</span> <span class="token parameter variable">-sv</span> /usr/local/make/bin/make /usr/bin/make
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后再升级glibc：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /root/glibc-2.28/build

<span class="token punctuation">..</span>/configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/usr --disable-profile --enable-add-ons --with-headers<span class="token operator">=</span>/usr/include --with-binutils<span class="token operator">=</span>/usr/bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可能还会报错bision太旧：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>configure: error:
*** These critical programs are missing or too old: bison
*** Check the INSTALL <span class="token function">file</span> <span class="token keyword">for</span> required versions.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>解决办法：升级bison</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> <span class="token parameter variable">-y</span> bison
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>继续更新glibc:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /root/glibc-2.28/build

<span class="token punctuation">..</span>/configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/usr --disable-profile --enable-add-ons --with-headers<span class="token operator">=</span>/usr/include --with-binutils<span class="token operator">=</span>/usr/bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span> <span class="token comment"># 时间会比较久</span>

<span class="token builtin class-name">cd</span> /usr/lib64
<span class="token function">rm</span> <span class="token parameter variable">-rf</span> libstdc++.so.6
<span class="token function">ln</span> <span class="token parameter variable">-s</span> libstdc++.so.6.0.26 libstdc++.so.6

ll <span class="token operator">|</span> <span class="token function">grep</span> libstdc++.so.6
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可能需要升级libstdc++.so.6:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /usr/local/lib64/
<span class="token comment"># 下载最新版本的\`下载最新版本的libstdc.so_.6.0.26\`</span>
<span class="token function">wget</span> http://www.vuln.cn/wp-content/uploads/2019/08/libstdc.so_.6.0.26.zip
<span class="token comment"># 解压</span>
<span class="token function">unzip</span> libstdc.so_.6.0.26.zip
<span class="token comment"># 将下载的最新版本拷贝到 /usr/lib64</span>
<span class="token function">cp</span> libstdc++.so.6.0.26 /usr/lib64
<span class="token builtin class-name">cd</span>  /usr/lib64
<span class="token comment"># 查看 /usr/lib64下libstdc++.so.6链接的版本</span>
<span class="token function">ls</span> <span class="token parameter variable">-l</span> <span class="token operator">|</span> <span class="token function">grep</span> libstdc++
<span class="token comment"># 删除原先的软连接(不放心可以备份)</span>
<span class="token function">rm</span> libstdc++.so.6
<span class="token comment"># 使用最新的库建立软连接</span>
<span class="token function">ln</span> <span class="token parameter variable">-s</span> libstdc++.so.6.0.26 libstdc++.so.6
<span class="token comment"># 查看新版本，成功</span>
strings /usr/lib64/libstdc++.so.6 <span class="token operator">|</span> <span class="token function">grep</span> GLIBCXX
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>验证下node版本即可</li></ol><p><img src="`+i+'" alt="alt text"></p>',27),o=[c];function t(r,d){return n(),a("div",null,o)}const u=s(l,[["render",t],["__file","20240527.html.vue"]]);export{u as default};
