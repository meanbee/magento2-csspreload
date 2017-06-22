# Magento 2 CSS Preload

Simple module that allows for asynchronous CSS loading in Magento 2

## Installation

1. Go to your Magento root directory
2. Run ```composer require meanbee/magento2-csspreload```

## Development

### Setting up a development environment

A Docker development environment is included with the project:

```
mkdir magento
docker-compose up -d db # Allow a few seconds for the db to initalise
docker-compose run --rm cli bash /src/setup.sh
docker-compose up -d
```


## Usage
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
            </item>
        </argument>
    </arguments>
</referenceBlock>
```
