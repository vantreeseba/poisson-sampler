 ![Travis Badge](https://travis-ci.org/vantreeseba/poisson-sampler.svg?branch=master)

A poisson disc sampler implementation.

<a name="PoissonDiscSampler"></a>

## PoissonDiscSampler
A fast poison disc sampler.
Based on https://www.jasondavies.com/poisson-disc/

**Kind**: global class  

* [PoissonDiscSampler](#PoissonDiscSampler)
    * [new PoissonDiscSampler(width, height, x, y, radius)](#new_PoissonDiscSampler_new)
    * [.getPoints()](#PoissonDiscSampler+getPoints) ⇒ <code>Array</code>
    * [.run()](#PoissonDiscSampler+run)
    * [.far(x, y)](#PoissonDiscSampler+far)
    * [.xyToIndex(x, y)](#PoissonDiscSampler+xyToIndex) ⇒ <code>Number</code>
    * [.sample(x, y)](#PoissonDiscSampler+sample) ⇒ <code>Object</code>
    * [.remove(x, y)](#PoissonDiscSampler+remove)

<a name="new_PoissonDiscSampler_new"></a>

### new PoissonDiscSampler(width, height, x, y, radius)
constructor


| Param | Type | Description |
| --- | --- | --- |
| width | <code>Number</code> | The width of the sample space. |
| height | <code>Number</code> | The height of the sample space. |
| x | <code>Number</code> | The offset from "world" center (if you're using multiple samplers). |
| y | <code>Number</code> | The offset from world center. |
| radius | <code>Number</code> | The minimum radius between points. |

<a name="PoissonDiscSampler+getPoints"></a>

### poissonDiscSampler.getPoints() ⇒ <code>Array</code>
Get all sample points from sampler.

**Kind**: instance method of [<code>PoissonDiscSampler</code>](#PoissonDiscSampler)  
**Returns**: <code>Array</code> - An array of points.  
<a name="PoissonDiscSampler+run"></a>

### poissonDiscSampler.run()
Runs the sampler.

**Kind**: instance method of [<code>PoissonDiscSampler</code>](#PoissonDiscSampler)  
<a name="PoissonDiscSampler+far"></a>

### poissonDiscSampler.far(x, y)
far

**Kind**: instance method of [<code>PoissonDiscSampler</code>](#PoissonDiscSampler)  

| Param | Type |
| --- | --- |
| x | <code>Number</code> | 
| y | <code>Number</code> | 

<a name="PoissonDiscSampler+xyToIndex"></a>

### poissonDiscSampler.xyToIndex(x, y) ⇒ <code>Number</code>
Get an index into the grid based from the x,y coord.

**Kind**: instance method of [<code>PoissonDiscSampler</code>](#PoissonDiscSampler)  
**Returns**: <code>Number</code> - The index into the grid array.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The x coord. |
| y | <code>Number</code> | The y coord. |

<a name="PoissonDiscSampler+sample"></a>

### poissonDiscSampler.sample(x, y) ⇒ <code>Object</code>
Record a sample.

**Kind**: instance method of [<code>PoissonDiscSampler</code>](#PoissonDiscSampler)  
**Returns**: <code>Object</code> - The point sampled.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The x coord of the sample. |
| y | <code>Number</code> | The y coord of the sample. |

<a name="PoissonDiscSampler+remove"></a>

### poissonDiscSampler.remove(x, y)
Remove a sample from the grid.
It will be replaced with new one the next time get points is called.

**Kind**: instance method of [<code>PoissonDiscSampler</code>](#PoissonDiscSampler)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The x coord. |
| y | <code>Number</code> | The y coord. |

