import{_ as n,o as s,c as a,e as p}from"./app-ae419367.js";const t={},e=p(`<h1 id="记录一个好用的timer函数" tabindex="-1"><a class="header-anchor" href="#记录一个好用的timer函数" aria-hidden="true">#</a> 记录一个好用的timer函数</h1><p>最近看到一个项目封装了时间函数，感觉挺好用的，记录一下。项目地址是：<code>https://github.com/leeenx/puzzle</code></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Timer</span> <span class="token punctuation">{</span>
    <span class="token comment">// 构造函数 </span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        <span class="token comment">// 暂停状态 - 这是个公共状态，由外部 Ticker 决定。</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>paused <span class="token operator">=</span> <span class="token boolean">true</span>

        <span class="token comment">// 队列</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>queue <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

        <span class="token comment">// 正在使用 timer 的 RAF</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>usingRAF <span class="token operator">=</span> <span class="token boolean">false</span>

        <span class="token comment">// useRAF 触发器</span>
        Reflect<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token string">&quot;useRAF&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
            <span class="token function-variable function">set</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                Reflect<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token string">&quot;usingRAF&quot;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
                value <span class="token operator">?</span> Timer<span class="token punctuation">.</span><span class="token constant">RAF</span><span class="token punctuation">.</span><span class="token function">enable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">:</span> Timer<span class="token punctuation">.</span><span class="token constant">RAF</span><span class="token punctuation">.</span><span class="token function">disable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// setTimeout 的实现</span>
    <span class="token function">setTimeout</span><span class="token punctuation">(</span>fn<span class="token punctuation">,</span> delay<span class="token punctuation">,</span> id <span class="token operator">=</span> <span class="token function">Symbol</span><span class="token punctuation">(</span><span class="token string">&quot;timeoutID&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        <span class="token comment">// 存入队列 </span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>queue<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">fn</span><span class="token operator">:</span> fn<span class="token punctuation">,</span> 
            <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> 
            <span class="token literal-property property">paused</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> 
            <span class="token literal-property property">elapsed</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> 
            <span class="token literal-property property">delay</span><span class="token operator">:</span> delay
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> id
    <span class="token punctuation">}</span>

    <span class="token comment">// clearTimeout</span>
    <span class="token function">clearTimeout</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// setInterval 的实现</span>
    <span class="token function">setInterval</span><span class="token punctuation">(</span>fn<span class="token punctuation">,</span> delay<span class="token punctuation">,</span> id <span class="token operator">=</span> <span class="token function">Symbol</span><span class="token punctuation">(</span><span class="token string">&quot;intervalID&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 存入队列</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>queue<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">fn</span><span class="token operator">:</span> fn<span class="token punctuation">,</span> 
            <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> 
            <span class="token literal-property property">paused</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> 
            <span class="token literal-property property">elapsed</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> 
            <span class="token literal-property property">delay</span><span class="token operator">:</span> delay
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> id
    <span class="token punctuation">}</span>

    <span class="token comment">// clearInterval</span>
    <span class="token function">clearInterval</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 修改指定id的 delay/fn</span>
    <span class="token function">set</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> config <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        <span class="token keyword">let</span> item <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>queue<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> config<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            item<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> config<span class="token punctuation">[</span>key<span class="token punctuation">]</span>
        <span class="token punctuation">}</span>
	      <span class="token keyword">return</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 删除 queue 上的成员</span>
    <span class="token keyword">delete</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>queue<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 暂停指定id</span>
    <span class="token function">pause</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        id <span class="token operator">===</span> <span class="token keyword">undefined</span> <span class="token operator">?</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">pauseAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>queue<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">.</span>paused <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">)</span>
	      <span class="token keyword">return</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 恢复指定id</span>
    <span class="token function">resume</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">play</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> 
    
    <span class="token comment">// 播放指定id</span>
    <span class="token function">play</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        id <span class="token operator">===</span> <span class="token keyword">undefined</span> <span class="token operator">?</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">playAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>queue<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">.</span>paused <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">)</span>
	      <span class="token keyword">return</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span> 

    <span class="token comment">// 清空timer</span>
    <span class="token function">clean</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>queue <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	      <span class="token keyword">return</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 暂停全部 id</span>
    <span class="token function">pauseAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>queue<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">item</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> item<span class="token punctuation">.</span>paused <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">)</span>
	      <span class="token keyword">return</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 播放全部 id</span>
    <span class="token function">playAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>queue<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">item</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> item<span class="token punctuation">.</span>paused <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">)</span>
	      <span class="token keyword">return</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// tick</span>
    <span class="token function">tick</span><span class="token punctuation">(</span><span class="token parameter">delta</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        <span class="token keyword">this</span><span class="token punctuation">.</span>paused <span class="token operator">||</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">updateQueue</span><span class="token punctuation">(</span>delta<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 更新 map 队列</span>
    <span class="token function">updateQueue</span><span class="token punctuation">(</span><span class="token parameter">delta</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        <span class="token keyword">this</span><span class="token punctuation">.</span>queue<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">item<span class="token punctuation">,</span> id</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span>paused <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">return</span>
            item<span class="token punctuation">.</span>elapsed <span class="token operator">+=</span> delta
            <span class="token keyword">if</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span>elapsed <span class="token operator">&gt;=</span> item<span class="token punctuation">.</span>delay<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                item<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                item<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">(</span>item<span class="token punctuation">.</span>elapsed <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">)</span>
            <span class="token punctuation">}</span> 
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 状态更新</span>
    <span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        <span class="token comment">// 第一次调用 update 时主动停用原生接口</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>useRAF <span class="token operator">=</span> <span class="token boolean">false</span>

        <span class="token comment">// 下面是真正的 update</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function-variable function">update</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">delta</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        	<span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>usingRAF<span class="token punctuation">)</span> <span class="token keyword">return</span>
	        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">tick</span><span class="token punctuation">(</span>delta<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> 
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">AnimationFrame</span> <span class="token punctuation">{</span> 
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>time <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>auto <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">auto</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token function">auto</span><span class="token punctuation">(</span><span class="token parameter">elapsed</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        timer<span class="token punctuation">.</span><span class="token function">tick</span><span class="token punctuation">(</span>elapsed <span class="token operator">-</span> <span class="token keyword">this</span><span class="token punctuation">.</span>time<span class="token punctuation">)</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>time <span class="token operator">=</span> elapsed
        <span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> <span class="token function">requestAnimationFrame</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>auto<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token function">enable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        timer<span class="token punctuation">.</span>paused <span class="token operator">=</span> <span class="token boolean">false</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> <span class="token function">requestAnimationFrame</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>auto<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token function">disable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">cancelAnimationFrame</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>id<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 原生RAF</span>
Timer<span class="token punctuation">.</span><span class="token constant">RAF</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AnimationFrame</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment">// 对外接口</span>
<span class="token keyword">let</span> timer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Timer</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment">// 默认使用原生 RAF</span>
timer<span class="token punctuation">.</span>useRAF <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token comment">// 导出timer</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> timer<span class="token punctuation">;</span> 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),o=[e];function c(i,l){return s(),a("div",null,o)}const k=n(t,[["render",c],["__file","20240818.html.vue"]]);export{k as default};
