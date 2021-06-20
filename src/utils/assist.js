// 递归遍历获取所有名为 componentName 的 children 组件
export const findComponentsDownward = (context, componentName, components = []) => {
    if (Array.isArray(context)) {
        for (let component of context) {
            if (component.type && component.type.displayName === componentName) {
                components.push(component)
            }
            if (component.props && component.props.children)
                findComponentsDownward(component.props.children, componentName, components)
        }
    } else if (context) {
        if (context.type && context.type.displayName === componentName) {
            components.push(context)
        }
        findComponentsDownward(context.props && context.props.children, componentName, components)
    }
    return components
}