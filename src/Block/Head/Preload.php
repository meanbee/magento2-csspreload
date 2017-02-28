<?php

namespace Meanbee\CSSPreload\Block\Head;

class Preload extends \Magento\Framework\View\Element\AbstractBlock
{
    protected $_template;

    public function __construct(
        \Magento\Framework\View\Element\Context $context,
        string $template,
        array $data = []
    ) {
        parent::__construct($context, $data);

        $this->_template = $template;
    }

    /**
     * Produce and return block's html output
     *
     * @return string
     */
    protected function _toHtml() {
        $html = '';
        $assets = $this->getAssets();

        if (empty($assets)) {
            return;
        }

        foreach ($assets as $asset) {
            $attributesHtml = sprintf('%s="%s"', $asset['attributes']['name'], $asset['attributes']['value']);
            $assetUrl = $this->_assetRepo->getUrl($asset['path']);
            $html .= sprintf($this->_template, $assetUrl, $attributesHtml);
        }

        return $html;
    }

}
