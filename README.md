# Magento 2 CSS Preload

Simple module that allows for asynchronous CSS loading in Magento 2

## Installation

1. Go to your Magento root directory
2. Run ```composer require meanbee/magento2-csspreload```

## Development

### Setting up a development environment

A Docker development environment is included with the project:

```
docker-compose run --rm cli magento-extension-installer Meanbee_CSSPreload
docker-compose up -d
```


## Usage

To add assets to the block, provide the `assets` argument:

```
<referenceBlock name="head.csspreload">
    <arguments>
        <argument name="assets" xsi:type="array">
            <item name="unique_name" xsi:type="array">
                <item name="path" xsi:type="string">css/filename.css</item>
                <item name="attributes" xsi:type="array">
                    <item name="name" xsi:type="string">attribute</item>
                    <item name="value" xsi:type="string">value</item>
                </item>
            </item>
        </argument>
    </arguments>
</referenceBlock>
```

To modify the template of the generated `<link />` tags, provide a `link_template` argument, e.g.:

```
<referenceBlock name="head.csspreload">
    <arguments>
        <argument name="link_template" xsi:type="string"><![CDATA[<link rel="preload" as="style" href=":path:" onload="this.rel='stylesheet'" :attributes: />]]></argument>
    </arguments>
</referenceBlock>
```

There are two variables that will be substituted: `:path:`, which will be replaced by the asset path, and `:attributes:` that will contain your `attributes` of your `assets` as HTML attributes.