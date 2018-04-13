<?php

namespace Meanbee\CSSPreload\Block\Head;

/**
 * @method array getAssets()
 * @method bool hasLinkTemplate()
 * @method void setLinkTemplate(string $template)
 * @method string getLinkTemplate()
 */
class Preload extends \Magento\Framework\View\Element\AbstractBlock
{
    const PATTERN_ATTRS = ':attributes:';
    const PATTERN_URL   = ':path:';

    public function __construct(
        \Magento\Framework\View\Element\Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);
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
            return "\n<!-- CSS Preload: No assets provided -->\n";
        }

        if (!$this->hasLinkTemplate()) {
            return "\n<!-- CSS Preload: No template defined -->\n";
        }

        foreach ($assets as $asset) {
            $attributesHtml = sprintf('%s="%s"', $asset['attributes']['name'], $asset['attributes']['value']);
            $assetUrl = $this->_assetRepo->getUrl($asset['path']);
            $html .= $this->renderLinkTemplate($assetUrl, $attributesHtml);
        }

        return $html;
    }

    /**
     * @param string $assetUrl
     * @param string $additionalAttributes
     * @return string
     */
    private function renderLinkTemplate($assetUrl, $additionalAttributes)
    {
        return str_replace(
            [self::PATTERN_URL, self::PATTERN_ATTRS],
            [$assetUrl, $additionalAttributes],
            $this->getLinkTemplate()
        );
    }
}
