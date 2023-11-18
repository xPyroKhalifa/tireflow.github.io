using PointOfSale.Business.Contracts;
using PointOfSale.Data.Repository;
using PointOfSale.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PointOfSale.Business.Services
{
    public class MenuService: IMenuService
    {
        private readonly IGenericRepository<Menu> _repositoryMenu;
        private readonly IGenericRepository<RolMenu> _repositoryRolMenu;
        private readonly IGenericRepository<User> _repositoryUser;
        public MenuService(
            IGenericRepository<Menu> repositoryMenu,
            IGenericRepository<RolMenu> repositoryRolMenu,
             IGenericRepository<User> repositoryUser
            )
        {
            _repositoryMenu = repositoryMenu;
            _repositoryRolMenu = repositoryRolMenu;
            _repositoryUser = repositoryUser;
        }
        public async Task<List<Menu>> GetMenus(int idUser)
        {
            IQueryable<User> tbUser = await _repositoryUser.Query(u => u.IdUsers == idUser);
            IQueryable<RolMenu> tbRolmenu = await _repositoryRolMenu.Query();
            IQueryable<Menu> tbMenu = await _repositoryMenu.Query();


            IQueryable<Menu> MenuParent = (from u in tbUser
                                          join rm in tbRolmenu on u.IdRol equals rm.IdRol
                                          join m in tbMenu on rm.IdMenu equals m.IdMenu
                                          join mparent in tbMenu on m.IdMenuParent equals mparent.IdMenu
                                          select mparent).Distinct().AsQueryable();

            IQueryable<Menu> MenuChild = (from u in tbUser
                                          join rm in tbRolmenu on u.IdRol equals rm.IdRol
                                          join m in tbMenu on rm.IdMenu equals m.IdMenu
                                          where m.IdMenu != m.IdMenuParent
                                          select m).Distinct().AsQueryable();

            List<Menu> listMenu = (from mpadre in MenuParent
                                    select new Menu()
                                    {
                                        Description = mpadre.Description,
                                        Icon = mpadre.Icon,
                                        Controller = mpadre.Controller,
                                        PageAction = mpadre.PageAction,
                                        InverseIdMenuParentNavigation = (from mchild in MenuChild
                                                                        where mchild.IdMenuParent == mpadre.IdMenu
                                                                        select mchild).ToList()
                                    }).ToList();

            return listMenu;
        }
    }
}
