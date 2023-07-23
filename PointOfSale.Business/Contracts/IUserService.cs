using PointOfSale.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PointOfSale.Business.Contracts
{
    public interface IUserService
    {
        Task<List<User>> List();
        Task<User> Add(User entity);
        Task<User> Edit(User entity);
        Task<bool> Delete(int idUser);
        Task<User> GetByCredentials(string email, string password);
        Task<User> GetById(int IdUser);
    }
}
