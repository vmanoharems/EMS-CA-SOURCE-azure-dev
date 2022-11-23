SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO



CREATE PROCEDURE [dbo].[InsertUpdateCompanyCreation]
(
@CompanyID int,
@CompanyCode nvarchar(5),
@ProductionTitle nvarchar(50),
@CompanyName nvarchar(50),
@Address1 nvarchar(50),
@Address2 nvarchar(50),
@Address3 nvarchar(50),
@City nvarchar(50),
@State nvarchar(50),
@Zip nvarchar(10),
@CompanyPhone nvarchar(16),
@Contact nvarchar(30),
@Entry int,
@Cost int,
@Format nvarchar(20),
@FiscalStartDate Datetime,
@DefaultValue nvarchar(50),
@Createdby int,
@ProdID int,
@PeriodStart datetime,
@Country nvarchar(50),
@PeriodStartType varchar(50)
)
AS
BEGIN
 -- SET NOCOUNT ON added to prevent extra result sets from
 -- interfering with SELECT statements.
 SET NOCOUNT ON;
 if(@CompanyID=0)
 begin

 insert into dbo.Company (CompanyCode,ProductionTitle,CompanyName,Address1,Address2,Address3,City,State,Zip,CompanyPhone,Contact,Entry,Cost,Format,FiscalStartDate,
 DefaultValue ,Status,Createddate,createdby,ProdID,Defaultflag,PeriodStart,Country,PeriodStartType) values
    (@CompanyCode ,@ProductionTitle,@CompanyName,@Address1,@Address2,@Address3,@City,@State,@Zip,@CompanyPhone,@Contact,@Entry,@Cost,@Format,@FiscalStartDate,@DefaultValue,'Active',CURRENT_TIMESTAMP,@Createdby,@ProdID,0,@PeriodStart,@Country,@PeriodStartType);

   select  SCOPE_IDENTITY()as int
 
 end
 else
 begin
 
 update dbo.Company set CompanyCode=@CompanyCode,ProductionTitle=@ProductionTitle,CompanyName=@CompanyName,
 Address1=@Address1,Address2=@Address2,Address3=@Address3,City=@City,State=@State,Zip=@Zip,CompanyPhone=@CompanyPhone,
 Contact=@Contact,Entry=@Entry,Cost=@Cost,Format=@Format,FiscalStartDate=@FiscalStartDate,DefaultValue=@DefaultValue,PeriodStart=@PeriodStart,Country=@Country,
 PeriodStartType=@PeriodStartType ,
 modifieddate=CURRENT_TIMESTAMP,modifiedby=@Createdby where CompanyID=@CompanyID and ProdID=@ProdID;

 select @CompanyID 

 end


END





GO