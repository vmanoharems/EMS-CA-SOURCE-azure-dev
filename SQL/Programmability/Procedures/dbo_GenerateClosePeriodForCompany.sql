SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE Procedure [dbo].[GenerateClosePeriodForCompany]
@CompanyId int

AS
BEGIN

Declare @Start datetime
Declare @End datetime
Declare @Type varchar(20)
Declare @Value varchar(20)



select @Type=PeriodStartType,@Value=DefaultValue  from Company  where CompanyID=@CompanyID

If (@Type='Period End')

begin

If (@Value='Weekly')
begin
select @End=PeriodStart  from Company  where CompanyID=@CompanyID 
set @Start=(SELECT DATEADD(DAY, -7, @End))



INSERT INTO [dbo].[ClosePeriod]([CompanyId],[CompanyPeriod],[StartPeriod],[EndPeriod],[Status],[PeriodStatus],[CreatedBy])
     VALUES(@CompanyID,1,@Start,@End,'Open','Current',1)

INSERT INTO [dbo].[ClosePeriod]([CompanyId],[CompanyPeriod],[StartPeriod],[EndPeriod],[Status],[PeriodStatus],[CreatedBy])
     VALUES(@CompanyID,2,@End,DATEADD(DAY, 7, @End),'Open','Future',1)

END
else 
begin
select @End=PeriodStart  from Company  where CompanyID=@CompanyID 
set @Start=(SELECT DATEADD(DAY, -15, @End))


INSERT INTO [dbo].[ClosePeriod]([CompanyId],[CompanyPeriod],[StartPeriod],[EndPeriod],[Status],[PeriodStatus],[CreatedBy])
     VALUES(@CompanyID,1,@Start,@End,'Open','Current',1)

INSERT INTO [dbo].[ClosePeriod]([CompanyId],[CompanyPeriod],[StartPeriod],[EndPeriod],[Status],[PeriodStatus],[CreatedBy])
     VALUES(@CompanyID,2,@End,DATEADD(DAY, 15, @End),'Open','Future',1)


end;

END

 
else 

begin

If (@Value='Weekly')
begin
select @Start=PeriodStart  from Company  where CompanyID=@CompanyID 
set @End=(SELECT DATEADD(DAY, 7, @Start))

INSERT INTO [dbo].[ClosePeriod]([CompanyId],[CompanyPeriod],[StartPeriod],[EndPeriod],[Status],[PeriodStatus],[CreatedBy])
     VALUES(@CompanyID,1,@Start,@End,'Open','Current',1)

INSERT INTO [dbo].[ClosePeriod]([CompanyId],[CompanyPeriod],[StartPeriod],[EndPeriod],[Status],[PeriodStatus],[CreatedBy])
     VALUES(@CompanyID,2,@End,DATEADD(DAY, 7, @End),'Open','Future',1)

END
else 
begin
select @Start=PeriodStart  from Company  where CompanyID=@CompanyID 
set @End=(SELECT DATEADD(DAY, 15, @Start))



INSERT INTO [dbo].[ClosePeriod]([CompanyId],[CompanyPeriod],[StartPeriod],[EndPeriod],[Status],[PeriodStatus],[CreatedBy])
     VALUES(@CompanyID,1,@Start,@End,'Open','Current',1)

INSERT INTO [dbo].[ClosePeriod]([CompanyId],[CompanyPeriod],[StartPeriod],[EndPeriod],[Status],[PeriodStatus],[CreatedBy])
     VALUES(@CompanyID,2,@End,DATEADD(DAY, 15, @End),'Open','Future',1)
end;

end
end










GO