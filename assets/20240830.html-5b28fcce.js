import{_ as e,o as a,c as i,e as d}from"./app-ae419367.js";const s={},t=d(`<h1 id="git目录下的子目录和文件" tabindex="-1"><a class="header-anchor" href="#git目录下的子目录和文件" aria-hidden="true">#</a> .git目录下的子目录和文件</h1><p>每个git仓库下都有一个.git目录，这个目录是隐藏的，可以通过ls -a命令查看。</p><ul><li><strong>hooks</strong></li><li><strong>info</strong></li><li><strong>objects</strong></li><li><strong>refs</strong></li><li>config</li><li>HEAD</li><li>description</li><li>index</li><li>packed-refs</li><li>COMMIT_EDITMSG</li></ul><h2 id="head-git-head" tabindex="-1"><a class="header-anchor" href="#head-git-head" aria-hidden="true">#</a> HEAD: .git/head</h2><p>当前分支名称</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ cat .git/HEAD
ref: refs/heads/master
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="branch-git-refs-heads-main" tabindex="-1"><a class="header-anchor" href="#branch-git-refs-heads-main" aria-hidden="true">#</a> branch: .git/refs/heads/main</h2><p>包括一个commit Id</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ cat .git/refs/heads/main
872345678901234567890123456789012345678
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="commit-git-objects-10-93da429" tabindex="-1"><a class="header-anchor" href="#commit-git-objects-10-93da429" aria-hidden="true">#</a> commit: .git/objects/10/93da429...</h2><p>commit包含的tree Id、author、committer、message等</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ git cat-file -p ec9c88dc6b579cf8f7a4be8f746cc672b0bcdfac
tree f97f9cf91ad05364865f796c7cda9e993b36dea3
parent b1af210923d2f077919b8ca234a57dbd42a4bfbb
author liqiu &lt;qiuli@sohu-inc.com&gt; 1724926020 +0800
committer liqiu &lt;qiuli@sohu-inc.com&gt; 1724926020 +0800

chore:actions配置更改
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="tree-git-objects-9f-83ee7550" tabindex="-1"><a class="header-anchor" href="#tree-git-objects-9f-83ee7550" aria-hidden="true">#</a> tree: .git/objects/9f/83ee7550...</h2><p>tree包含一些blob文件</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$  git cat-file -p 9f83ee7550919867e9219a75c23624c92ab5bd83
100644 blob e69de29bb2d1d6434b8b29ae775ad8c2e48c5391	.gitignore
100644 blob 665c637a360874ce43bf74018768a96d2d4d219a	hello.py
040000 tree 24420a1530b1f4ec20ddb14c76df8c78c48f76a6	lib
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="blobs-git-objects-5a-475762c" tabindex="-1"><a class="header-anchor" href="#blobs-git-objects-5a-475762c" aria-hidden="true">#</a> blobs: .git/objects/5a/475762c...</h2><p>blob文件中包含具体的代码</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ git cat-file -p 665c637a360874ce43bf74018768a96d2d4d219a	
print(&quot;hello world!&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="reflog-git-logs-refs-heads-main" tabindex="-1"><a class="header-anchor" href="#reflog-git-logs-refs-heads-main" aria-hidden="true">#</a> reflog: .git/logs/refs/heads/main</h2><p>reflog保存了每一个分支的历史记录</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ tail -n 1 .git/logs/refs/heads/main
33a0481b440426f0268c613d036b820bc064cdea
1093da429f08e0e54cdc2b31526159e745d98ce0
Julia Evans &lt;julia@example.com&gt;
1706119866 -0500
commit: add hello.py
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="tags-git-refs-tags-v1-0" tabindex="-1"><a class="header-anchor" href="#tags-git-refs-tags-v1-0" aria-hidden="true">#</a> tags: .git/refs/tags/v1.0</h2><p>包含commit Id</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ cat .git/refs/tags/v1.0
1093da429f08e0e54cdc2b31526159e745d98ce0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="the-stash-git-refs-stash" tabindex="-1"><a class="header-anchor" href="#the-stash-git-refs-stash" aria-hidden="true">#</a> the stash: .git/refs/stash</h2><p>保存运行stash命令时生成的commit Id</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cat .git/refs/stash
62caf3d918112d54bcfa24f3c78a94c224283a78
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,27),n=[t];function l(r,c){return a(),i("div",null,n)}const b=e(s,[["render",l],["__file","20240830.html.vue"]]);export{b as default};
