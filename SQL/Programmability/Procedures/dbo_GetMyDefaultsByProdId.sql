SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetMyDefaultsByProdId] ---------- GetMyDefaultsByProdId 17
@UserId int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 -- Insert statements for procedure here
declare @def  int,
@level int,
 @m1 int,
  @m2 int,
   @m3 int, 
   @m1name nvarchar(20),
      @m2name nvarchar(20),
	     @m3name nvarchar(20),
@Cid int,@Ccode nvarchar(50),
@CuId int ,@CuName nvarchar(50),
@Sid int ,@SName nvarchar(50),
@BId int,@BName nvarchar(50)

select  @def=convert(int,Defvalue)  from  Mydefault  where UserId=@UserId  and type='StartScreen'

select  @level=ModuleLevel from Module  where  ModuleId=@def
if @level=1
begin
set @m1=@def
set @m2=0
set @m3=0
end

else if @level=2

begin 
set @m1=(select parentid from Module  where ModuleId=@def)
set @m2=@def
set @m3=0
end

else if @level=3

begin 


set @m3=@def
set @m2=(select parentid from Module  where ModuleId=@m3)
set @m1=(select parentid from Module  where ModuleId=@m2)
end

select @m1name= ModuleName  from Module where ModuleId=@m1
select @m2name= ModuleName  from Module where ModuleId=@m2
select @m3name= ModuleName  from Module where ModuleId=@m3



select @Cid=c.CompanyID ,@Ccode=c.CompanyCode from Mydefault left outer join Company c on c.CompanyID=Mydefault.Defvalue  where mydefault.UserId=@UserId and mydefault.Type='Company'

select @CuId=c.CurrencyID ,@CuName=c.CurrencyName from Mydefault left outer join Currecny c on c.CurrencyID=Mydefault.Defvalue  where mydefault.UserId=@UserId and mydefault.Type='Currency'


select @Sid=Mydefault.Defvalue ,@SName=c.AccountCode from Mydefault left outer join TblAccounts c on c.AccountId=Mydefault.Defvalue 
 where mydefault.UserId=@UserId and mydefault.Type='Source'

select @BId=c.BankId ,@BName=c.Bankname from Mydefault left outer join BankInfo c on c.BankId=Mydefault.Defvalue  where mydefault.UserId=@UserId and mydefault.Type='Bank'
select @m1 as m1Id ,isnull(@m1name ,'')as m1name,@m2 as m2Id,isnull(@m2name,'')as m2name,@m3 as m3Id,isnull(@m3name,'') as m3name ,

@Cid as CompanyId ,@Ccode as  Companycode,
@CuId as CurrencyId,@CuName as CurrencyName,
@Sid as SourceId,  @SName as Episode,
@BId as BankId,@BName as BankName




END



GO