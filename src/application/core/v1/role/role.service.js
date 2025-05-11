const { RoleMenu, Role, Admin } = require('../../../../database/models');
const BaseService = require('../../../../@core/service/BaseService');

class RoleService extends BaseService {
  async checkPermission(roleId, guard) {
    const menus = await RoleMenu.findAll({ where: { roleId }, include: 'menu' }).then((resp) =>
      resp.map((d) => ({ slug: d.menu.slug, permissions: d.permissions })),
    );
    return (
      menus.filter(
        (resp) => resp.slug === guard.menu && resp.permissions.includes(guard.permission),
      ).length > 0
    );
  }

  findOneWithDetail(id) {
    return super.findOne({
      where: { id },
      include: [
        {
          association: 'modules',
          include: 'module',
        },
      ],
    });
  }

  async insertOrUpdateModules(modules, id) {
    const data = modules.map((d) => ({ ...d, roleId: id }));
    await RoleMenu.destroy({
      where: { roleId: id },
    });
    return RoleMenu.bulkCreate(data);
  }

  async roleIsUse(id) {
    return Admin.findOne({ where: { roleId: id } });
  }
}

module.exports = new RoleService(Role);
