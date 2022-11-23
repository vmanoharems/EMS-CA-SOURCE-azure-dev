SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetDefaultSettingByUserId] -- GetDefaultSettingByUserId 16
	-- Add the parameters for the stored procedure here
	@UserId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	

declare @mid int, @Pid int,@MD1 nvarchar(50),@MD2 nvarchar(50),
@Cid int,@Ccode nvarchar(50),
@CuId int ,@CuName nvarchar(50),
@Sid int ,@SName nvarchar(50),
@BId int,@BName nvarchar(50)
select @mid=defvalue From mydefault where userid=@UserId and type='startscreen'
select @MD1 =modulename from module where moduleid=@mid


select @pid=isnull(parentid,0) from module where moduleid=@mid
if(@pid=0)
begin
set @MD2='-';
set @pid=@mid;
set @mid=0;
end
else
begin
--set @mid=@pid;
set @MD2=@MD1;
select @MD1=modulename, @Pid=moduleid from module where moduleid=@pid

end
select @Cid=c.CompanyID ,@Ccode=c.CompanyCode from Mydefault left outer join Company c on c.CompanyID=Mydefault.Defvalue  where mydefault.UserId=@UserId and mydefault.Type='Company'

select @CuId=c.CurrencyID ,@CuName=c.CurrencyName from Mydefault left outer join Currecny c on c.CurrencyID=Mydefault.Defvalue  where mydefault.UserId=@UserId and mydefault.Type='Currency'


select @Sid=Mydefault.Defvalue ,@SName=c.AccountCode from Mydefault left outer join TblAccounts c on c.AccountId=Mydefault.Defvalue 
 where mydefault.UserId=@UserId and mydefault.Type='Source'

select @BId=c.BankId ,@BName=c.Bankname from Mydefault left outer join BankInfo c on c.BankId=Mydefault.Defvalue  where mydefault.UserId=@UserId and mydefault.Type='Bank'

select @MD1 as Module1,@MD2 as Module2,@pid as Module1Id,@mid as Module2Id, 
@Cid as CompanyId ,@Ccode as  Companycode,
@CuId as CurrencyId,@CuName as CurrencyName,
@Sid as SourceId,  @SName as SourceCode,
@BId as BankId,@BName as BankName



END


GO