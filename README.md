 ![Travis Badge](https://travis-ci.org/vantreeseba/poisson-sampler.svg?branch=master)

A poisson disc sampler implementation.

<pre>
<p data-height="265" data-theme-id="0" data-slug-hash="gKbRYx" data-default-tab="result" data-user="vantreeseba" data-embed-version="2" data-pen-title="Fast poisson disc sampler with removal/respawn" class="codepen">See the Pen <a href="https://codepen.io/vantreeseba/pen/gKbRYx/">Fast poisson disc sampler with removal/respawn</a> by Ben Van Treese (<a href="https://codepen.io/vantreeseba">@vantreeseba</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
</pre>

## Classes

<dl>
<dt><a href="#MultiSampler">MultiSampler</a></dt>
<dd><p>A poisson sampler that is a grid of samplers (this allows infinite worlds to use this).</p>
</dd>
<dt><a href="#RandomSampler">RandomSampler</a></dt>
<dd><p>A fast poison disc sampler.
Based on <a href="https://www.jasondavies.com/poisson-disc/">https://www.jasondavies.com/poisson-disc/</a></p>
</dd>
<dt><a href="#PoissonDiscSampler">PoissonDiscSampler</a></dt>
<dd><p>A fast poison disc sampler.
Based on <a href="https://www.jasondavies.com/poisson-disc/">https://www.jasondavies.com/poisson-disc/</a></p>
</dd>
</dl>

<a name="MultiSampler"></a>

## MultiSampler
A poisson sampler that is a grid of samplers (this allows infinite worlds to use this).

**Kind**: global class  

* [MultiSampler](#MultiSampler)
    * [new MultiSampler(config)](#new_MultiSampler_new)
    * [.getPoints()](#MultiSampler+getPoints) ⇒ <code>Array</code>
    * [.getPointsForCell(x, y)](#MultiSampler+getPointsForCell) ⇒ <code>Array</code>
    * [.resize(h, w)](#MultiSampler+resize)
    * [.prePopulate(points)](#MultiSampler+prePopulate)

<a name="new_MultiSampler_new"></a>

### new MultiSampler(config)
Create a multisampler.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | The config for the sampler. |
| [config.w] | <code>Number</code> | <code>64</code> | The width of the entire sample space. |
| [config.h] | <code>Number</code> | <code>64</code> | The height of the entire sample space. |
| [config.cw] | <code>Number</code> | <code>32</code> | The width of each sub sampler. |
| [config.ch] | <code>Number</code> | <code>32</code> | The height of each subsampler. |
| [config.r] | <code>Number</code> | <code>10</code> | The minimum radius between samples. |

<a name="MultiSampler+getPoints"></a>

### multiSampler.getPoints() ⇒ <code>Array</code>
Get all points from all sub-samplers.

**Kind**: instance method of [<code>MultiSampler</code>](#MultiSampler)  
**Returns**: <code>Array</code> - The array of points.  
<a name="MultiSampler+getPointsForCell"></a>

### multiSampler.getPointsForCell(x, y) ⇒ <code>Array</code>
Get points for a single cell.

**Kind**: instance method of [<code>MultiSampler</code>](#MultiSampler)  
**Returns**: <code>Array</code> - The array of points.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The x coord in the cell. |
| y | <code>Number</code> | The y coord in the cell. |

<a name="MultiSampler+resize"></a>

### multiSampler.resize(h, w)
Resize the multisampler.

**Kind**: instance method of [<code>MultiSampler</code>](#MultiSampler)  

| Param | Type | Description |
| --- | --- | --- |
| h | <code>Number</code> | New height. |
| w | <code>Number</code> | New width. |

<a name="MultiSampler+prePopulate"></a>

### multiSampler.prePopulate(points)
Prepopulates all the sub-samplers with the given points,
rejecting ones outside the subsamplers.

**Kind**: instance method of [<code>MultiSampler</code>](#MultiSampler)  

| Param | Type | Description |
| --- | --- | --- |
| points | <code>Array</code> | The points to seed subsamplers with. |

<a name="RandomSampler"></a>

## RandomSampler
A fast poison disc sampler.
Based on https://www.jasondavies.com/poisson-disc/

**Kind**: global class  

* [RandomSampler](#RandomSampler)
    * [new RandomSampler(config)](#new_RandomSampler_new)
    * [.getPoints()](#RandomSampler+getPoints) ⇒ <code>Array</code>
    * [.run()](#RandomSampler+run)
    * [.remove(x, y)](#RandomSampler+remove)
    * [.prePopulate(points)](#RandomSampler+prePopulate)

<a name="new_RandomSampler_new"></a>

### new RandomSampler(config)
constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | The config for the sampler. |
| [config.w] | <code>Number</code> | <code>64</code> | The width of the sample space. |
| [config.h] | <code>Number</code> | <code>64</code> | The height of the sample space. |
| [config.x] | <code>Number</code> | <code>0</code> | The offset from "world" center (if you're using multiple samplers). |
| [config.y] | <code>Number</code> | <code>0</code> | The offset from world center. |
| [config.r] | <code>Number</code> | <code>10</code> | The minimum radius between points. |

<a name="RandomSampler+getPoints"></a>

### randomSampler.getPoints() ⇒ <code>Array</code>
Get all sample points from sampler.

**Kind**: instance method of [<code>RandomSampler</code>](#RandomSampler)  
**Returns**: <code>Array</code> - An array of points.  
<a name="RandomSampler+run"></a>

### randomSampler.run()
Runs the sampler.

**Kind**: instance method of [<code>RandomSampler</code>](#RandomSampler)  
<a name="RandomSampler+remove"></a>

### randomSampler.remove(x, y)
Remove a sample from the grid.
It will be replaced with new one the next time get points is called.

**Kind**: instance method of [<code>RandomSampler</code>](#RandomSampler)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The x coord. |
| y | <code>Number</code> | The y coord. |

<a name="RandomSampler+prePopulate"></a>

### randomSampler.prePopulate(points)
Pre-populate the sampler with points.

**Kind**: instance method of [<code>RandomSampler</code>](#RandomSampler)  

| Param | Type | Description |
| --- | --- | --- |
| points | <code>Array</code> | The points to add to the sampler. |

<a name="PoissonDiscSampler"></a>

## PoissonDiscSampler
A fast poison disc sampler.
Based on https://www.jasondavies.com/poisson-disc/

**Kind**: global class  

* [PoissonDiscSampler](#PoissonDiscSampler)
    * [new PoissonDiscSampler(config)](#new_PoissonDiscSampler_new)
    * [.getPoints()](#PoissonDiscSampler+getPoints) ⇒ <code>Array</code>
    * [.run()](#PoissonDiscSampler+run)
    * [.remove(x, y)](#PoissonDiscSampler+remove)
    * [.prePopulate(points)](#PoissonDiscSampler+prePopulate)

<a name="new_PoissonDiscSampler_new"></a>

### new PoissonDiscSampler(config)
constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | The config for the sampler. |
| [config.w] | <code>Number</code> | <code>64</code> | The width of the sample space. |
| [config.h] | <code>Number</code> | <code>64</code> | The height of the sample space. |
| [config.x] | <code>Number</code> | <code>0</code> | The offset from "world" center (if you're using multiple samplers). |
| [config.y] | <code>Number</code> | <code>0</code> | The offset from world center. |
| [config.r] | <code>Number</code> | <code>10</code> | The minimum radius between points. |

<a name="PoissonDiscSampler+getPoints"></a>

### poissonDiscSampler.getPoints() ⇒ <code>Array</code>
Get all sample points from sampler.

**Kind**: instance method of [<code>PoissonDiscSampler</code>](#PoissonDiscSampler)  
**Returns**: <code>Array</code> - An array of points.  
<a name="PoissonDiscSampler+run"></a>

### poissonDiscSampler.run()
Runs the sampler.

**Kind**: instance method of [<code>PoissonDiscSampler</code>](#PoissonDiscSampler)  
<a name="PoissonDiscSampler+remove"></a>

### poissonDiscSampler.remove(x, y)
Remove a sample from the grid.
It will be replaced with new one the next time get points is called.

**Kind**: instance method of [<code>PoissonDiscSampler</code>](#PoissonDiscSampler)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The x coord. |
| y | <code>Number</code> | The y coord. |

<a name="PoissonDiscSampler+prePopulate"></a>

### poissonDiscSampler.prePopulate(points)
Pre-populate the sampler with points.

**Kind**: instance method of [<code>PoissonDiscSampler</code>](#PoissonDiscSampler)  

| Param | Type | Description |
| --- | --- | --- |
| points | <code>Array</code> | The points to add to the sampler. |

