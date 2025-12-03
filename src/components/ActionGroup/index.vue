<script lang="ts">
import { defineComponent, h, Fragment, isVNode, cloneVNode } from "vue";
import {
  ElDivider,
  ElDropdown,
  ElDropdownMenu,
  ElButton,
  ElIcon,
} from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";

export default defineComponent({
  name: "ActionGroup",
  props: {
    max: { type: Number, default: 3 },
  },
  setup(props, { slots }) {
    const getValidNodes = (nodes: VNode[]): VNode[] => {
      let result: VNode[] = [];

      nodes.forEach((node) => {
        if (node.type === Fragment && Array.isArray(node.children)) {
          result.push(...getValidNodes(node.children as VNode[]));
          return;
        }

        if (!isVNode(node)) {
          return;
        }

        const componentType = node.type as any;
        if (
          typeof componentType === "object" &&
          componentType.name === "ActionItem"
        ) {
          result.push(node);
        }
      });

      return result;
    };

    return () => {
      if (!slots.default) return null;

      const allNodes = getValidNodes(slots.default());

      let visibleNodes: VNode[] = [];
      let dropdownNodes: VNode[] = [];

      if (allNodes.length <= props.max) {
        visibleNodes = allNodes.map((node) =>
          cloneVNode(node, { _isDropdown: false }),
        );
      } else {
        visibleNodes = allNodes
          .slice(0, props.max - 1)
          .map((node) => cloneVNode(node, { _isDropdown: false }));
        dropdownNodes = allNodes
          .slice(props.max - 1)
          .map((node) => cloneVNode(node, { _isDropdown: true }));
      }

      const children: VNode[] = [];

      visibleNodes.forEach((node, index) => {
        children.push(node);
        if (index < visibleNodes.length - 1 || dropdownNodes.length > 0) {
          children.push(h(ElDivider, { direction: "vertical" }));
        }
      });

      if (dropdownNodes.length > 0) {
        children.push(
          h(
            ElDropdown,
            {},
            {
              default: () =>
                h(
                  ElButton,
                  { link: true, type: "primary", class: "outline-none" },
                  {
                    default: () => [
                      "更多",
                      h(ElIcon, null, { default: () => h(ArrowDown) }),
                    ],
                  },
                ),
              dropdown: () =>
                h(
                  ElDropdownMenu,
                  {},
                  {
                    default: () => dropdownNodes,
                  },
                ),
            },
          ),
        );
      }

      return h("div", { class: "flex items-center" }, children);
    };
  },
});
</script>
