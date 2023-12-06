import{_ as n,o as s,c as a,e as t}from"./app-001236c0.js";const p={},e=t(`<h1 id="n-body问题" tabindex="-1"><a class="header-anchor" href="#n-body问题" aria-hidden="true">#</a> n-body问题</h1><h1 id="一-原理" tabindex="-1"><a class="header-anchor" href="#一-原理" aria-hidden="true">#</a> 一 原理</h1><p>N-body问题（或者说N体问题），是一个常见的物理模拟问题。在N-body系统中，每个粒子体都会与剩下的其他粒子产生交互作用（交互作用因具体问题而异），从而产生相应的物理现象。</p><h1 id="二-代码" tabindex="-1"><a class="header-anchor" href="#二-代码" aria-hidden="true">#</a> 二 代码</h1><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;math.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdlib.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;timer.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;files.h&quot;</span></span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">SOFTENING</span> <span class="token expression"><span class="token number">1e-9f</span></span></span>

<span class="token comment">/*
 * Each body contains x, y, and z coordinate positions,
 * as well as velocities in the x, y, and z directions.
 */</span>

<span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token punctuation">{</span> <span class="token keyword">float</span> x<span class="token punctuation">,</span> y<span class="token punctuation">,</span> z<span class="token punctuation">,</span> vx<span class="token punctuation">,</span> vy<span class="token punctuation">,</span> vz<span class="token punctuation">;</span> <span class="token punctuation">}</span> Body<span class="token punctuation">;</span>

<span class="token comment">/*
 * Calculate the gravitational impact of all bodies in the system
 * on all others.
 */</span>

__global__ <span class="token keyword">void</span> <span class="token function">bodyForce</span><span class="token punctuation">(</span>Body <span class="token operator">*</span>p<span class="token punctuation">,</span> <span class="token keyword">float</span> dt<span class="token punctuation">,</span> <span class="token keyword">int</span> n<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">int</span> i <span class="token operator">=</span> threadIdx<span class="token punctuation">.</span>x<span class="token operator">+</span>blockIdx<span class="token punctuation">.</span>x<span class="token operator">*</span>blockDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;</span> n<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">float</span> Fx <span class="token operator">=</span> <span class="token number">0.0f</span><span class="token punctuation">;</span> <span class="token keyword">float</span> Fy <span class="token operator">=</span> <span class="token number">0.0f</span><span class="token punctuation">;</span> <span class="token keyword">float</span> Fz <span class="token operator">=</span> <span class="token number">0.0f</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">float</span> dx <span class="token operator">=</span> p<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">.</span>x <span class="token operator">-</span> p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>x<span class="token punctuation">;</span>
            <span class="token keyword">float</span> dy <span class="token operator">=</span> p<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">.</span>y <span class="token operator">-</span> p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>y<span class="token punctuation">;</span>
            <span class="token keyword">float</span> dz <span class="token operator">=</span> p<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">.</span>z <span class="token operator">-</span> p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>z<span class="token punctuation">;</span>
            <span class="token keyword">float</span> distSqr <span class="token operator">=</span> dx<span class="token operator">*</span>dx <span class="token operator">+</span> dy<span class="token operator">*</span>dy <span class="token operator">+</span> dz<span class="token operator">*</span>dz <span class="token operator">+</span> SOFTENING<span class="token punctuation">;</span>
            <span class="token keyword">float</span> invDist <span class="token operator">=</span> <span class="token function">rsqrtf</span><span class="token punctuation">(</span>distSqr<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">float</span> invDist3 <span class="token operator">=</span> invDist <span class="token operator">*</span> invDist <span class="token operator">*</span> invDist<span class="token punctuation">;</span>
            Fx <span class="token operator">+=</span> dx <span class="token operator">*</span> invDist3<span class="token punctuation">;</span> Fy <span class="token operator">+=</span> dy <span class="token operator">*</span> invDist3<span class="token punctuation">;</span> Fz <span class="token operator">+=</span> dz <span class="token operator">*</span> invDist3<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>vx <span class="token operator">+=</span> dt<span class="token operator">*</span>Fx<span class="token punctuation">;</span> p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>vy <span class="token operator">+=</span> dt<span class="token operator">*</span>Fy<span class="token punctuation">;</span> p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>vz <span class="token operator">+=</span> dt<span class="token operator">*</span>Fz<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

__global__ <span class="token keyword">void</span> <span class="token function">integrate_position</span><span class="token punctuation">(</span>Body <span class="token operator">*</span>p<span class="token punctuation">,</span><span class="token keyword">float</span> dt<span class="token punctuation">,</span><span class="token keyword">int</span> n<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">int</span> i<span class="token operator">=</span>threadIdx<span class="token punctuation">.</span>x<span class="token operator">+</span>blockIdx<span class="token punctuation">.</span>x<span class="token operator">*</span>blockDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span>i<span class="token operator">&lt;</span>n<span class="token punctuation">)</span><span class="token punctuation">{</span>
        p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>x <span class="token operator">+=</span> p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>vx<span class="token operator">*</span>dt<span class="token punctuation">;</span>
        p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>y <span class="token operator">+=</span> p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>vy<span class="token operator">*</span>dt<span class="token punctuation">;</span>
        p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>z <span class="token operator">+=</span> p<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>vz<span class="token operator">*</span>dt<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token keyword">int</span> argc<span class="token punctuation">,</span> <span class="token keyword">const</span> <span class="token keyword">char</span><span class="token operator">*</span><span class="token operator">*</span> argv<span class="token punctuation">)</span> <span class="token punctuation">{</span>

  <span class="token comment">// The assessment will test against both 2&lt;11 and 2&lt;15.</span>
  <span class="token comment">// Feel free to pass the command line argument 15 when you gernate ./nbody report files</span>
  <span class="token keyword">int</span> nBodies <span class="token operator">=</span> <span class="token number">2</span><span class="token operator">&lt;&lt;</span><span class="token number">11</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>argc <span class="token operator">&gt;</span> <span class="token number">1</span><span class="token punctuation">)</span> nBodies <span class="token operator">=</span> <span class="token number">2</span><span class="token operator">&lt;&lt;</span><span class="token function">atoi</span><span class="token punctuation">(</span>argv<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// The assessment will pass hidden initialized values to check for correctness.</span>
  <span class="token comment">// You should not make changes to these files, or else the assessment will not work.</span>
  <span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span> initialized_values<span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span> solution_values<span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>nBodies <span class="token operator">==</span> <span class="token number">2</span><span class="token operator">&lt;&lt;</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    initialized_values <span class="token operator">=</span> <span class="token string">&quot;files/initialized_4096&quot;</span><span class="token punctuation">;</span>
    solution_values <span class="token operator">=</span> <span class="token string">&quot;files/solution_4096&quot;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span> <span class="token comment">// nBodies == 2&lt;&lt;15</span>
    initialized_values <span class="token operator">=</span> <span class="token string">&quot;files/initialized_65536&quot;</span><span class="token punctuation">;</span>
    solution_values <span class="token operator">=</span> <span class="token string">&quot;files/solution_65536&quot;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>argc <span class="token operator">&gt;</span> <span class="token number">2</span><span class="token punctuation">)</span> initialized_values <span class="token operator">=</span> argv<span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>argc <span class="token operator">&gt;</span> <span class="token number">3</span><span class="token punctuation">)</span> solution_values <span class="token operator">=</span> argv<span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token keyword">float</span> dt <span class="token operator">=</span> <span class="token number">0.01f</span><span class="token punctuation">;</span> <span class="token comment">// Time step</span>
  <span class="token keyword">const</span> <span class="token keyword">int</span> nIters <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>  <span class="token comment">// Simulation iterations</span>

  <span class="token keyword">int</span> bytes <span class="token operator">=</span> nBodies <span class="token operator">*</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span>Body<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">float</span> <span class="token operator">*</span>buf<span class="token punctuation">;</span>

  buf <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">float</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token function">malloc</span><span class="token punctuation">(</span>bytes<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Body *p = (Body*)buf;</span>
  <span class="token comment">// cudaMallocHost((void **)&amp;buf, bytes);</span>
  
  <span class="token function">cudaMallocManaged</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>buf<span class="token punctuation">,</span> bytes<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Body <span class="token operator">*</span>p <span class="token operator">=</span> <span class="token punctuation">(</span>Body <span class="token operator">*</span><span class="token punctuation">)</span>buf<span class="token punctuation">;</span>

  <span class="token function">read_values_from_file</span><span class="token punctuation">(</span>initialized_values<span class="token punctuation">,</span> buf<span class="token punctuation">,</span> bytes<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">double</span> totalTime <span class="token operator">=</span> <span class="token number">0.0</span><span class="token punctuation">;</span>

  <span class="token comment">/*
   * This simulation will run for 10 cycles of time, calculating gravitational
   * interaction amongst bodies, and adjusting their positions to reflect.
   */</span>

  size_t block_size <span class="token operator">=</span> <span class="token number">32</span><span class="token punctuation">;</span>
  size_t block_num <span class="token operator">=</span> <span class="token punctuation">(</span>nBodies <span class="token operator">+</span> block_size <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">/</span> block_size<span class="token punctuation">;</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> iter <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> iter <span class="token operator">&lt;</span> nIters<span class="token punctuation">;</span> iter<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">StartTimer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/*
   * You will likely wish to refactor the work being done in \`bodyForce\`,
   * and potentially the work to integrate the positions.
   */</span>
   
    bodyForce<span class="token operator">&lt;&lt;</span><span class="token operator">&lt;</span>block_num<span class="token punctuation">,</span>block_size<span class="token operator">&gt;&gt;</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>p<span class="token punctuation">,</span> dt<span class="token punctuation">,</span> nBodies<span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    <span class="token comment">// bodyForce(p, dt, nBodies); // compute interbody forces</span>

  <span class="token comment">/*
   * This position integration cannot occur until this round of \`bodyForce\` has completed.
   * Also, the next round of \`bodyForce\` cannot begin until the integration is complete.
   */</span>

    integrate_position<span class="token operator">&lt;&lt;</span><span class="token operator">&lt;</span>block_num<span class="token punctuation">,</span>block_size<span class="token operator">&gt;&gt;</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>p<span class="token punctuation">,</span>dt<span class="token punctuation">,</span>nBodies<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 执行到最后一次，GPU内存数据传到CPU</span>
    <span class="token comment">// if(iter == nIters-1)</span>
       <span class="token comment">// cudaMemcpy(buf,d_buf,bytes,cudaMemcpyDeviceToHost);</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span>iter <span class="token operator">==</span> nIters<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
       <span class="token function">cudaDeviceSynchronize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">const</span> <span class="token keyword">double</span> tElapsed <span class="token operator">=</span> <span class="token function">GetTimer</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">1000.0</span><span class="token punctuation">;</span>
    totalTime <span class="token operator">+=</span> tElapsed<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">double</span> avgTime <span class="token operator">=</span> totalTime <span class="token operator">/</span> <span class="token punctuation">(</span><span class="token keyword">double</span><span class="token punctuation">)</span><span class="token punctuation">(</span>nIters<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">float</span> billionsOfOpsPerSecond <span class="token operator">=</span> <span class="token number">1e-9</span> <span class="token operator">*</span> nBodies <span class="token operator">*</span> nBodies <span class="token operator">/</span> avgTime<span class="token punctuation">;</span>
  <span class="token function">write_values_to_file</span><span class="token punctuation">(</span>solution_values<span class="token punctuation">,</span> buf<span class="token punctuation">,</span> bytes<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// You will likely enjoy watching this value grow as you accelerate the application,</span>
  <span class="token comment">// but beware that a failure to correctly synchronize the device might result in</span>
  <span class="token comment">// unrealistically high values.</span>
  <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;%0.3f Billion Interactions / second&quot;</span><span class="token punctuation">,</span> billionsOfOpsPerSecond<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">free</span><span class="token punctuation">(</span>buf<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),o=[e];function c(i,l){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","3.html.vue"]]);export{r as default};
