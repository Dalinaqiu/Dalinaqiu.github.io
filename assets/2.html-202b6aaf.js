import{_ as e,r as o,o as c,c as i,a as s,b as n,d as t,e as p}from"./app-ae419367.js";const l={},u=s("h1",{id:"利用基本的-cuda-内存管理技术来优化加速应用程序",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#利用基本的-cuda-内存管理技术来优化加速应用程序","aria-hidden":"true"},"#"),n(" 利用基本的 CUDA 内存管理技术来优化加速应用程序")],-1),r=s("h3",{id:"统一内存-um-的迁移",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#统一内存-um-的迁移","aria-hidden":"true"},"#"),n(" 统一内存(UM)的迁移")],-1),k={href:"https://en.wikipedia.org/wiki/Page_fault",target:"_blank",rel:"noopener noreferrer"},d=p(`<p>能够执行页错误并按需迁移内存对于在加速应用程序中简化开发流程大有助益。此外，在处理展示稀疏访问模式的数据时（例如，在应用程序实际运行之前无法得知需要处理的数据时），以及在具有多个 GPU 的加速系统中，数据可能由多个 GPU 设备访问时，按需迁移内存将会带来显著优势。</p><p>有些情况下（例如，在运行时之前需要得知数据，以及需要大量连续的内存块时），我们还能有效规避页错误和按需数据迁移所产生的开销。</p><p>本实验的后续内容将侧重于对按需迁移的理解，以及如何在分析器输出中识别按需迁移。这些知识可让您在享受按需迁移优势的同时，减少其产生的开销。</p><h3 id="练习-重新审视矢量加法程序的um行为" tabindex="-1"><a class="header-anchor" href="#练习-重新审视矢量加法程序的um行为" aria-hidden="true">#</a> 练习：重新审视矢量加法程序的UM行为</h3><p>返回您一直在本实验中执行的 <a href="../edit/01-vector-add/01-vector-add.cu">01-vector-add.cu</a> 程序，查看当前状态的代码库，并假设您预期会发生哪种类型的内存迁移和/或页面错误。 查看最后一次重构的概要分析输出（通过向上滚动查找输出或通过执行下面的代码执行单元），并观察性能分析器输出的 <em>CUDA内存操作统计信息</em> 部分。 您能否根据代码库的内容解释迁移的种类及其操作的数量？</p><h3 id="练习-在核函数中初始化向量" tabindex="-1"><a class="header-anchor" href="#练习-在核函数中初始化向量" aria-hidden="true">#</a> 练习：在核函数中初始化向量</h3><p>当 <code>nsys profile</code> 给出核函数所需的执行时间时，则在此函数执行期间发生的主机到设备页错误和数据迁移都会包含在所显示的执行时间中。</p><p>带着这样的想法来将 <a href="../edit/01-vector-add/01-vector-add.cu">01-vector-add.cu</a> 程序中的 <code>initWith</code> 主机函数重构为 CUDA 核函数，以便在 GPU 上并行初始化所分配的向量。成功编译及运行重构的应用程序后，但在对其进行分析之前，请假设如下内容：</p><ul><li>您期望重构会对 UM 页错误行为产生何种影响？</li><li>您期望重构会对所报告的 <code>addVectorsInto</code> 运行时产生何种影响？</li></ul><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>

<span class="token comment">/*
 * Refactor host function to run as CUDA kernel
 */</span>

__global__
<span class="token keyword">void</span> <span class="token function">initWith</span><span class="token punctuation">(</span><span class="token keyword">float</span> num<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>a<span class="token punctuation">,</span> <span class="token keyword">int</span> N<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">int</span> index <span class="token operator">=</span> threadIdx<span class="token punctuation">.</span>x <span class="token operator">+</span> blockIdx<span class="token punctuation">.</span>x <span class="token operator">*</span> blockDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>
  <span class="token keyword">int</span> stride <span class="token operator">=</span> blockDim<span class="token punctuation">.</span>x <span class="token operator">*</span> gridDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>

  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> index<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> N<span class="token punctuation">;</span> i <span class="token operator">+=</span> stride<span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    a<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> num<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

__global__
<span class="token keyword">void</span> <span class="token function">addArraysInto</span><span class="token punctuation">(</span><span class="token keyword">float</span> <span class="token operator">*</span>result<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>a<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>b<span class="token punctuation">,</span> <span class="token keyword">int</span> N<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">int</span> index <span class="token operator">=</span> threadIdx<span class="token punctuation">.</span>x <span class="token operator">+</span> blockIdx<span class="token punctuation">.</span>x <span class="token operator">*</span> blockDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>
  <span class="token keyword">int</span> stride <span class="token operator">=</span> blockDim<span class="token punctuation">.</span>x <span class="token operator">*</span> gridDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>

  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> index<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> N<span class="token punctuation">;</span> i <span class="token operator">+=</span> stride<span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    result<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> a<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+</span> b<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">checkElementsAre</span><span class="token punctuation">(</span><span class="token keyword">float</span> target<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>array<span class="token punctuation">,</span> <span class="token keyword">int</span> N<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> N<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span>array<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!=</span> target<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
      <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;FAIL: array[%d] - %0.0f does not equal %0.0f\\n&quot;</span><span class="token punctuation">,</span> i<span class="token punctuation">,</span> array<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Success! All values calculated correctly.\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">int</span> deviceId<span class="token punctuation">;</span>
  <span class="token keyword">int</span> numberOfSMs<span class="token punctuation">;</span>

  <span class="token function">cudaGetDevice</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaDeviceGetAttribute</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>numberOfSMs<span class="token punctuation">,</span> cudaDevAttrMultiProcessorCount<span class="token punctuation">,</span> deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Device ID: %d\\tNumber of SMs: %d\\n&quot;</span><span class="token punctuation">,</span> deviceId<span class="token punctuation">,</span> numberOfSMs<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token keyword">int</span> N <span class="token operator">=</span> <span class="token number">2</span><span class="token operator">&lt;&lt;</span><span class="token number">24</span><span class="token punctuation">;</span>
  size_t size <span class="token operator">=</span> N <span class="token operator">*</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token keyword">float</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">float</span> <span class="token operator">*</span>a<span class="token punctuation">;</span>
  <span class="token keyword">float</span> <span class="token operator">*</span>b<span class="token punctuation">;</span>
  <span class="token keyword">float</span> <span class="token operator">*</span>c<span class="token punctuation">;</span>

  <span class="token function">cudaMallocManaged</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>a<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMallocManaged</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>b<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMallocManaged</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>c<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>

  size_t threadsPerBlock<span class="token punctuation">;</span>
  size_t numberOfBlocks<span class="token punctuation">;</span>

  threadsPerBlock <span class="token operator">=</span> <span class="token number">256</span><span class="token punctuation">;</span>
  numberOfBlocks <span class="token operator">=</span> <span class="token number">32</span> <span class="token operator">*</span> numberOfSMs<span class="token punctuation">;</span>

  cudaError_t addArraysErr<span class="token punctuation">;</span>
  cudaError_t asyncErr<span class="token punctuation">;</span>

  <span class="token comment">/*
   * Launch kernels.
   */</span>

  initWith<span class="token operator">&lt;&lt;</span><span class="token operator">&lt;</span>numberOfBlocks<span class="token punctuation">,</span> threadsPerBlock<span class="token operator">&gt;&gt;</span><span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> a<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>
  initWith<span class="token operator">&lt;&lt;</span><span class="token operator">&lt;</span>numberOfBlocks<span class="token punctuation">,</span> threadsPerBlock<span class="token operator">&gt;&gt;</span><span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">,</span> b<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>
  initWith<span class="token operator">&lt;&lt;</span><span class="token operator">&lt;</span>numberOfBlocks<span class="token punctuation">,</span> threadsPerBlock<span class="token operator">&gt;&gt;</span><span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> c<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/*
   * Now that initialization is happening on a GPU, host code
   * must be synchronized to wait for its completion.
   */</span>

  <span class="token function">cudaDeviceSynchronize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  addArraysInto<span class="token operator">&lt;&lt;</span><span class="token operator">&lt;</span>numberOfBlocks<span class="token punctuation">,</span> threadsPerBlock<span class="token operator">&gt;&gt;</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>

  addArraysErr <span class="token operator">=</span> <span class="token function">cudaGetLastError</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>addArraysErr <span class="token operator">!=</span> cudaSuccess<span class="token punctuation">)</span> <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Error: %s\\n&quot;</span><span class="token punctuation">,</span> <span class="token function">cudaGetErrorString</span><span class="token punctuation">(</span>addArraysErr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  asyncErr <span class="token operator">=</span> <span class="token function">cudaDeviceSynchronize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>asyncErr <span class="token operator">!=</span> cudaSuccess<span class="token punctuation">)</span> <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Error: %s\\n&quot;</span><span class="token punctuation">,</span> <span class="token function">cudaGetErrorString</span><span class="token punctuation">(</span>asyncErr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">checkElementsAre</span><span class="token punctuation">(</span><span class="token number">7</span><span class="token punctuation">,</span> c<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">cudaFree</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaFree</span><span class="token punctuation">(</span>b<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaFree</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="获得统一内存的细节" tabindex="-1"><a class="header-anchor" href="#获得统一内存的细节" aria-hidden="true">#</a> 获得统一内存的细节</h2><p>您一直使用 <code>cudaMallocManaged</code> 分配旨在供主机或设备代码使用的内存，并且现在仍在享受这种方法的便利之处，即在实现自动内存迁移且简化编程的同时，而无需深入了解 <code>cudaMallocManaged</code> 所分配<strong>统一内存</strong> (<strong>UM</strong>) 实际工作原理的详细信息。<code>nsys profile</code> 提供有关加速应用程序中 UM 管理的详细信息，并在利用这些信息的同时结合对 UM 工作原理的更深入理解，进而为优化加速应用程序创造更多机会。</p><h3 id="统一内存-um-的迁移-1" tabindex="-1"><a class="header-anchor" href="#统一内存-um-的迁移-1" aria-hidden="true">#</a> 统一内存(UM)的迁移</h3>`,13),v={href:"https://en.wikipedia.org/wiki/Page_fault",target:"_blank",rel:"noopener noreferrer"},m=p(`<p>能够执行页错误并按需迁移内存对于在加速应用程序中简化开发流程大有助益。此外，在处理展示稀疏访问模式的数据时（例如，在应用程序实际运行之前无法得知需要处理的数据时），以及在具有多个 GPU 的加速系统中，数据可能由多个 GPU 设备访问时，按需迁移内存将会带来显著优势。</p><p>有些情况下（例如，在运行时之前需要得知数据，以及需要大量连续的内存块时），我们还能有效规避页错误和按需数据迁移所产生的开销。</p><p>本实验的后续内容将侧重于对按需迁移的理解，以及如何在分析器输出中识别按需迁移。这些知识可让您在享受按需迁移优势的同时，减少其产生的开销。</p><h3 id="练习-探索统一内存-um-的页错误" tabindex="-1"><a class="header-anchor" href="#练习-探索统一内存-um-的页错误" aria-hidden="true">#</a> 练习：探索统一内存（UM）的页错误</h3><p><code>nsys profile</code> 会提供描述所分析应用程序 UM 行为的输出。在本练习中，您将对一个简单的应用程序做出一些修改，并会在每次更改后利用 <code>nsys profile</code> 的统一内存输出部分，探讨 UM 数据迁移的行为方式。</p><p>包含 <code>hostFunction</code> 和 <code>gpuKernel</code> 函数，我们可以通过这两个函数并使用数字 <code>1</code> 初始化 <code>2&lt;&lt;24</code> 个单元向量的元素。主机函数和 GPU 核函数目前均未使用。</p><p>对于以下 4 个问题中的每一问题，请根据您对 UM 行为的理解，首先假设应会发生何种页错误，然后使用代码库中所提供 2 个函数中的其中一个或同时使用这两个函数编辑 以创建场景，以便您测试假设。</p><p>为了检验您的假设，请使用下面的代码执行单元来编译和分析代码。 一定要记录从<code>nsys profile --stats = true</code>输出中获得的假设以及结果。 在<code>nsys profile --stats = true</code>的输出中，您应该查找以下内容：</p><ul><li>输出中是否有 <em>CUDA内存操作统计信息</em> 部分？</li><li>如果是，这是否表示数据从主机到设备（HtoD）或从设备到主机（DtoH）的迁移？</li><li>进行迁移时，输出如何说明有多少个“操作”？ 如果看到许多小的内存迁移操作，则表明按需出现页面错误，并且每次在请求的位置出现页面错误时都会发生小内存迁移。</li></ul><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code>__global__
<span class="token keyword">void</span> <span class="token function">deviceKernel</span><span class="token punctuation">(</span><span class="token keyword">int</span> <span class="token operator">*</span>a<span class="token punctuation">,</span> <span class="token keyword">int</span> N<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">int</span> idx <span class="token operator">=</span> threadIdx<span class="token punctuation">.</span>x <span class="token operator">+</span> blockIdx<span class="token punctuation">.</span>x <span class="token operator">*</span> blockDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>
  <span class="token keyword">int</span> stride <span class="token operator">=</span> blockDim<span class="token punctuation">.</span>x <span class="token operator">*</span> gridDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> idx<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> N<span class="token punctuation">;</span> i <span class="token operator">+=</span> stride<span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    a<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">hostFunction</span><span class="token punctuation">(</span><span class="token keyword">int</span> <span class="token operator">*</span>a<span class="token punctuation">,</span> <span class="token keyword">int</span> N<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> N<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    a<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>

  <span class="token keyword">int</span> N <span class="token operator">=</span> <span class="token number">2</span><span class="token operator">&lt;&lt;</span><span class="token number">24</span><span class="token punctuation">;</span>
  size_t size <span class="token operator">=</span> N <span class="token operator">*</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">int</span> <span class="token operator">*</span>a<span class="token punctuation">;</span>
  <span class="token function">cudaMallocManaged</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>a<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/*
   * Conduct experiments to learn more about the behavior of
   * \`cudaMallocManaged\`.
   *
   * What happens when unified memory is accessed only by the GPU?
   * What happens when unified memory is accessed only by the CPU?
   * What happens when unified memory is accessed first by the GPU then the CPU?
   * What happens when unified memory is accessed first by the CPU then the GPU?
   *
   * Hypothesize about UM behavior, page faulting specificially, before each
   * experiment, and then verify by running \`nsys\`.
   */</span>

  <span class="token function">cudaFree</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以下是供您探索的方案，以及遇到困难时的解决方案：</p><ul><li>当仅通过CPU访问统一内存时，是否存在内存迁移和/或页面错误的证据？（<a href="../edit/06-unified-memory-page-faults/solutions/01-page-faults-solution-cpu-only.cu">解决方案</a>）</li><li>当仅通过GPU访问统一内存时，是否有证据表明内存迁移和/或页面错误？（<a href="../edit/06-unified-memory-page-faults/solutions/02-page-faults-solution-gpu-only.cu">解决方案</a>）</li><li>当先由CPU然后由GPU访问统一内存时，是否有证据表明存在内存迁移和/或页面错误？（<a href="../edit/06-unified-memory-page-faults/solutions/03-page-faults-solution-cpu-then-gpu.cu">解决方案</a>）</li><li>当先由GPU然后由CPU访问统一内存时，是否存在内存迁移和/或页面错误的证据？ （<a href="../edit/06-unified-memory-page-faults/solutions/04-page-faults-solution-gpu-then-cpu.cu">解决方案</a>）</li></ul><hr><h2 id="异步内存预取" tabindex="-1"><a class="header-anchor" href="#异步内存预取" aria-hidden="true">#</a> 异步内存预取</h2><p>在主机到设备和设备到主机的内存传输过程中，我们使用一种技术来减少页错误和按需内存迁移成本，此强大技术称为<strong>异步内存预取</strong>。通过此技术，程序员可以在应用程序代码使用统一内存 (UM) 之前，在后台将其异步迁移至系统中的任何 CPU 或 GPU 设备。此举可以减少页错误和按需数据迁移所带来的成本，并进而提高 GPU 核函数和 CPU 函数的性能。</p><p>此外，预取往往会以更大的数据块来迁移数据，因此其迁移次数要低于按需迁移。此技术非常适用于以下情况：在运行时之前已知数据访问需求且数据访问并未采用稀疏模式。</p><p>CUDA 可通过 <code>cudaMemPrefetchAsync</code> 函数，轻松将托管内存异步预取到 GPU 设备或 CPU。以下所示为如何使用该函数将数据预取到当前处于活动状态的 GPU 设备，然后再预取到 CPU：</p><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token keyword">int</span> deviceId<span class="token punctuation">;</span>
<span class="token function">cudaGetDevice</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>                                         <span class="token comment">// The ID of the currently active GPU device.</span>

<span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>pointerToSomeUMData<span class="token punctuation">,</span> size<span class="token punctuation">,</span> deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>        <span class="token comment">// Prefetch to GPU device.</span>
<span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>pointerToSomeUMData<span class="token punctuation">,</span> size<span class="token punctuation">,</span> cudaCpuDeviceId<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Prefetch to host. \`cudaCpuDeviceId\` is a</span>
                                                                  <span class="token comment">// built-in CUDA variable.</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>

<span class="token keyword">void</span> <span class="token function">initWith</span><span class="token punctuation">(</span><span class="token keyword">float</span> num<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>a<span class="token punctuation">,</span> <span class="token keyword">int</span> N<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> N<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    a<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> num<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

__global__
<span class="token keyword">void</span> <span class="token function">addVectorsInto</span><span class="token punctuation">(</span><span class="token keyword">float</span> <span class="token operator">*</span>result<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>a<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>b<span class="token punctuation">,</span> <span class="token keyword">int</span> N<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">int</span> index <span class="token operator">=</span> threadIdx<span class="token punctuation">.</span>x <span class="token operator">+</span> blockIdx<span class="token punctuation">.</span>x <span class="token operator">*</span> blockDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>
  <span class="token keyword">int</span> stride <span class="token operator">=</span> blockDim<span class="token punctuation">.</span>x <span class="token operator">*</span> gridDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>

  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> index<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> N<span class="token punctuation">;</span> i <span class="token operator">+=</span> stride<span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    result<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> a<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+</span> b<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">checkElementsAre</span><span class="token punctuation">(</span><span class="token keyword">float</span> target<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>vector<span class="token punctuation">,</span> <span class="token keyword">int</span> N<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> N<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span>vector<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!=</span> target<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
      <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;FAIL: vector[%d] - %0.0f does not equal %0.0f\\n&quot;</span><span class="token punctuation">,</span> i<span class="token punctuation">,</span> vector<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Success! All values calculated correctly.\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">int</span> deviceId<span class="token punctuation">;</span>
  <span class="token keyword">int</span> numberOfSMs<span class="token punctuation">;</span>

  <span class="token function">cudaGetDevice</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaDeviceGetAttribute</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>numberOfSMs<span class="token punctuation">,</span> cudaDevAttrMultiProcessorCount<span class="token punctuation">,</span> deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Device ID: %d\\tNumber of SMs: %d\\n&quot;</span><span class="token punctuation">,</span> deviceId<span class="token punctuation">,</span> numberOfSMs<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token keyword">int</span> N <span class="token operator">=</span> <span class="token number">2</span><span class="token operator">&lt;&lt;</span><span class="token number">24</span><span class="token punctuation">;</span>
  size_t size <span class="token operator">=</span> N <span class="token operator">*</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token keyword">float</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">float</span> <span class="token operator">*</span>a<span class="token punctuation">;</span>
  <span class="token keyword">float</span> <span class="token operator">*</span>b<span class="token punctuation">;</span>
  <span class="token keyword">float</span> <span class="token operator">*</span>c<span class="token punctuation">;</span>

  <span class="token function">cudaMallocManaged</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>a<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMallocManaged</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>b<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMallocManaged</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>c<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">initWith</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> a<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">initWith</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">,</span> b<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">initWith</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> c<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/*
   * Add asynchronous prefetching after the data is initialized,
   * and before launching the kernel, to avoid host to GPU page
   * faulting.
   */</span>

  <span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> size<span class="token punctuation">,</span> deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>b<span class="token punctuation">,</span> size<span class="token punctuation">,</span> deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> size<span class="token punctuation">,</span> deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>

  size_t threadsPerBlock<span class="token punctuation">;</span>
  size_t numberOfBlocks<span class="token punctuation">;</span>

  threadsPerBlock <span class="token operator">=</span> <span class="token number">256</span><span class="token punctuation">;</span>
  numberOfBlocks <span class="token operator">=</span> <span class="token number">32</span> <span class="token operator">*</span> numberOfSMs<span class="token punctuation">;</span>

  cudaError_t addVectorsErr<span class="token punctuation">;</span>
  cudaError_t asyncErr<span class="token punctuation">;</span>

  addVectorsInto<span class="token operator">&lt;&lt;</span><span class="token operator">&lt;</span>numberOfBlocks<span class="token punctuation">,</span> threadsPerBlock<span class="token operator">&gt;&gt;</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>

  addVectorsErr <span class="token operator">=</span> <span class="token function">cudaGetLastError</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>addVectorsErr <span class="token operator">!=</span> cudaSuccess<span class="token punctuation">)</span> <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Error: %s\\n&quot;</span><span class="token punctuation">,</span> <span class="token function">cudaGetErrorString</span><span class="token punctuation">(</span>addVectorsErr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  asyncErr <span class="token operator">=</span> <span class="token function">cudaDeviceSynchronize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>asyncErr <span class="token operator">!=</span> cudaSuccess<span class="token punctuation">)</span> <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Error: %s\\n&quot;</span><span class="token punctuation">,</span> <span class="token function">cudaGetErrorString</span><span class="token punctuation">(</span>asyncErr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">checkElementsAre</span><span class="token punctuation">(</span><span class="token number">7</span><span class="token punctuation">,</span> c<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">cudaFree</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaFree</span><span class="token punctuation">(</span>b<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaFree</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="练习-将内存预取回cpu" tabindex="-1"><a class="header-anchor" href="#练习-将内存预取回cpu" aria-hidden="true">#</a> 练习：将内存预取回CPU</h3><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>

<span class="token keyword">void</span> <span class="token function">initWith</span><span class="token punctuation">(</span><span class="token keyword">float</span> num<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>a<span class="token punctuation">,</span> <span class="token keyword">int</span> N<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> N<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    a<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> num<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

__global__
<span class="token keyword">void</span> <span class="token function">addVectorsInto</span><span class="token punctuation">(</span><span class="token keyword">float</span> <span class="token operator">*</span>result<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>a<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>b<span class="token punctuation">,</span> <span class="token keyword">int</span> N<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">int</span> index <span class="token operator">=</span> threadIdx<span class="token punctuation">.</span>x <span class="token operator">+</span> blockIdx<span class="token punctuation">.</span>x <span class="token operator">*</span> blockDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>
  <span class="token keyword">int</span> stride <span class="token operator">=</span> blockDim<span class="token punctuation">.</span>x <span class="token operator">*</span> gridDim<span class="token punctuation">.</span>x<span class="token punctuation">;</span>

  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> index<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> N<span class="token punctuation">;</span> i <span class="token operator">+=</span> stride<span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    result<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> a<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+</span> b<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">checkElementsAre</span><span class="token punctuation">(</span><span class="token keyword">float</span> target<span class="token punctuation">,</span> <span class="token keyword">float</span> <span class="token operator">*</span>vector<span class="token punctuation">,</span> <span class="token keyword">int</span> N<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> N<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span>vector<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!=</span> target<span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
      <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;FAIL: vector[%d] - %0.0f does not equal %0.0f\\n&quot;</span><span class="token punctuation">,</span> i<span class="token punctuation">,</span> vector<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> target<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Success! All values calculated correctly.\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">int</span> deviceId<span class="token punctuation">;</span>
  <span class="token keyword">int</span> numberOfSMs<span class="token punctuation">;</span>

  <span class="token function">cudaGetDevice</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaDeviceGetAttribute</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>numberOfSMs<span class="token punctuation">,</span> cudaDevAttrMultiProcessorCount<span class="token punctuation">,</span> deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Device ID: %d\\tNumber of SMs: %d\\n&quot;</span><span class="token punctuation">,</span> deviceId<span class="token punctuation">,</span> numberOfSMs<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token keyword">int</span> N <span class="token operator">=</span> <span class="token number">2</span><span class="token operator">&lt;&lt;</span><span class="token number">24</span><span class="token punctuation">;</span>
  size_t size <span class="token operator">=</span> N <span class="token operator">*</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token keyword">float</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">float</span> <span class="token operator">*</span>a<span class="token punctuation">;</span>
  <span class="token keyword">float</span> <span class="token operator">*</span>b<span class="token punctuation">;</span>
  <span class="token keyword">float</span> <span class="token operator">*</span>c<span class="token punctuation">;</span>

  <span class="token function">cudaMallocManaged</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>a<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMallocManaged</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>b<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMallocManaged</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>c<span class="token punctuation">,</span> size<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/*
   * Prefetching can also be used to prevent CPU page faults.
   */</span>

  <span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> size<span class="token punctuation">,</span> cudaCpuDeviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>b<span class="token punctuation">,</span> size<span class="token punctuation">,</span> cudaCpuDeviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> size<span class="token punctuation">,</span> cudaCpuDeviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">initWith</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> a<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">initWith</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">,</span> b<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">initWith</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> c<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> size<span class="token punctuation">,</span> deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>b<span class="token punctuation">,</span> size<span class="token punctuation">,</span> deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> size<span class="token punctuation">,</span> deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>

  size_t threadsPerBlock<span class="token punctuation">;</span>
  size_t numberOfBlocks<span class="token punctuation">;</span>

  threadsPerBlock <span class="token operator">=</span> <span class="token number">256</span><span class="token punctuation">;</span>
  numberOfBlocks <span class="token operator">=</span> <span class="token number">32</span> <span class="token operator">*</span> numberOfSMs<span class="token punctuation">;</span>

  cudaError_t addVectorsErr<span class="token punctuation">;</span>
  cudaError_t asyncErr<span class="token punctuation">;</span>

  addVectorsInto<span class="token operator">&lt;&lt;</span><span class="token operator">&lt;</span>numberOfBlocks<span class="token punctuation">,</span> threadsPerBlock<span class="token operator">&gt;&gt;</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>

  addVectorsErr <span class="token operator">=</span> <span class="token function">cudaGetLastError</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>addVectorsErr <span class="token operator">!=</span> cudaSuccess<span class="token punctuation">)</span> <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Error: %s\\n&quot;</span><span class="token punctuation">,</span> <span class="token function">cudaGetErrorString</span><span class="token punctuation">(</span>addVectorsErr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  asyncErr <span class="token operator">=</span> <span class="token function">cudaDeviceSynchronize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>asyncErr <span class="token operator">!=</span> cudaSuccess<span class="token punctuation">)</span> <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Error: %s\\n&quot;</span><span class="token punctuation">,</span> <span class="token function">cudaGetErrorString</span><span class="token punctuation">(</span>asyncErr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/*
   * Prefetching can also be used to prevent CPU page faults.
   */</span>

  <span class="token function">cudaMemPrefetchAsync</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> size<span class="token punctuation">,</span> cudaCpuDeviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">checkElementsAre</span><span class="token punctuation">(</span><span class="token number">7</span><span class="token punctuation">,</span> c<span class="token punctuation">,</span> N<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">cudaFree</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaFree</span><span class="token punctuation">(</span>b<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">cudaFree</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,20);function b(f,y){const a=o("ExternalLinkIcon");return c(),i("div",null,[u,r,s("p",null,[n("分配 UM 时，内存尚未驻留在主机或设备上。主机或设备尝试访问内存时会发生 "),s("a",k,[n("页错误"),t(a)]),n("，此时主机或设备会批量迁移所需的数据。同理，当 CPU 或加速系统中的任何 GPU 尝试访问尚未驻留在其上的内存时，会发生页错误并触发迁移。")]),d,s("p",null,[n("分配 UM 时，内存尚未驻留在主机或设备上。主机或设备尝试访问内存时会发生 "),s("a",v,[n("页错误"),t(a)]),n("，此时主机或设备会批量迁移所需的数据。同理，当 CPU 或加速系统中的任何 GPU 尝试访问尚未驻留在其上的内存时，会发生页错误并触发迁移。")]),m])}const w=e(l,[["render",b],["__file","2.html.vue"]]);export{w as default};
