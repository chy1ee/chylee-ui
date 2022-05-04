export const converToMenus = (groupName, resources) =>{
  //console.log(resources)
  const tags = Array()
  const paths = {}
  const tagViews = Array()
  if (resources && resources.tags.length > 0) {
    resources.tags.forEach((resource) => {
      paths[resource.name] = []
      tags.push({
        name: resource.name,
        path: resource.name,
        title: resource.name,
        description: resource.description,
        children: paths[resource.name]
      })
    })
    for (let i in resources.paths) {
      const path = resources.paths[i]
      for (let j in path) {
        const method = path[j]
        for (let tag in method.tags) {
          const title = '[' + j.toUpperCase() + '] ' + method.summary
          paths[method.tags[tag]].push({
            path: '/api/info/' + groupName + '/' + method.operationId,
            title: title,
            method: j.toUpperCase()
          })
          tagViews.push({
            name: method.operationId,
            path: '/api/info/' + groupName + '/' + method.operationId,
            title: title,
            data: method
          })
        }
      }
    }
  }
  return { menuList: tags, tagViews }
}